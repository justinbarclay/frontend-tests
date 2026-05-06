#!/usr/bin/env node
import { spawn } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    build: { type: "boolean", short: "b", default: false },
    analyze: { type: "boolean", short: "a", default: false },
    top: { type: "boolean", short: "t", default: false },
    json: { type: "boolean", short: "j", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help) {
  console.log(`
Usage: ./scripts/stats.js [options]

Options:
  -b, --build    Build all repos in parallel
  -a, --analyze  Analyze bundle sizes from existing dist/stats.json files
  -t, --top      Show top 5 libraries by size for each bundle
  -j, --json     Output analysis as JSON (implies --analyze, skips --build)
  -h, --help     Show this help message

  With no options, both --build and --analyze are run.
`);
  process.exit(0);
}

const runBuild = !values.json && (values.build || (!values.build && !values.analyze));
const runAnalyze = values.json || values.analyze || (!values.build && !values.analyze);

const root = new URL(".", import.meta.url).pathname;
const repos = ["mantine-v8", "jolly-ui", "shadcn-baseui"];

// --- Build ---

async function buildAll() {
  console.log("🔨 Building all repos in parallel...\n");

  const builds = repos.map(
    (name) =>
      new Promise((resolveP) => {
        const cwd = resolve(root, "..", name);
        const proc = spawn("npm", ["run", "build"], { cwd, shell: true });

        const lines = [];
        const capture = (data) => {
          for (const line of data.toString().split("\n")) if (line.trim()) lines.push(line);
        };
        proc.stdout.on("data", capture);
        proc.stderr.on("data", capture);
        proc.on("close", (code) => resolveP({ name, code, lines }));
      }),
  );

  const results = await Promise.all(builds);
  let anyFailed = false;

  for (const { name, code, lines } of results) {
    const ok = code === 0;
    if (!ok) anyFailed = true;
    console.log(`${ok ? "✅" : "❌"} ${name} (exit ${code})`);
    if (!ok) {
      for (const line of lines) console.log(`   ${line}`);
    } else {
      const summary = lines.findLast((l) => l.includes("chunks of") || l.includes("built in"));
      if (summary) console.log(`   ${summary.trim()}`);
    }
  }

  if (anyFailed) process.exit(1);
}

// --- Analyze ---

function analyzeAll() {
  const toKB = (b) => (b / 1024).toFixed(1);
  const pad = (s, n) => String(s).padEnd(n);

  const results = [];

  for (const name of repos) {
    const path = resolve(root, "..", name, "dist", "stats.json");
    const chunks = JSON.parse(readFileSync(path, "utf8"));
    let totalParsed = 0,
      totalGzip = 0,
      totalBrotli = 0;
    let jsParsed = 0,
      jsGzip = 0,
      cssParsed = 0,
      cssGzip = 0;
    let nmSize = 0,
      appSize = 0;
    const pkgSizes = {};

    for (const c of chunks) {
      totalParsed += c.parsedSize || 0;
      totalGzip += c.gzipSize || 0;
      totalBrotli += c.brotliSize || 0;
      if (c.filename.endsWith(".js")) {
        jsParsed += c.parsedSize || 0;
        jsGzip += c.gzipSize || 0;
      }
      if (c.filename.endsWith(".css")) {
        cssParsed += c.parsedSize || 0;
        cssGzip += c.gzipSize || 0;
      }
      for (const top of c.source || []) {
        if (top.label === "node_modules") {
          nmSize += top.parsedSize || 0;
          for (const p of top.groups || [])
            pkgSizes[p.label] = (pkgSizes[p.label] || 0) + (p.parsedSize || 0);
        } else {
          appSize += top.parsedSize || 0;
        }
      }
    }

    results.push({
      name,
      totalParsed,
      totalGzip,
      totalBrotli,
      jsParsed,
      jsGzip,
      cssParsed,
      cssGzip,
      nmSize,
      appSize,
      top5: Object.entries(pkgSizes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    });
  }

  if (values.json) {
    const toEntry = (key) => Object.fromEntries(results.map((r) => [r.name, r[key]]));
    console.log(
      JSON.stringify(
        {
          repos: results.map((r) => r.name),
          summary: [
            { metric: "Total (parsed)", ...toEntry("totalParsed") },
            { metric: "Total (gzip)", ...toEntry("totalGzip") },
            { metric: "Total (brotli)", ...toEntry("totalBrotli") },
            { metric: "JS (parsed)", ...toEntry("jsParsed") },
            { metric: "JS (gzip)", ...toEntry("jsGzip") },
            { metric: "CSS (parsed)", ...toEntry("cssParsed") },
            { metric: "CSS (gzip)", ...toEntry("cssGzip") },
            { metric: "node_modules", ...toEntry("nmSize") },
            { metric: "App code", ...toEntry("appSize") },
          ],
          top5: Object.fromEntries(results.map((r) => [r.name, r.top5])),
        },
        null,
        2,
      ),
    );
    return;
  }

  const cols = ["Metric", ...results.map((r) => r.name)];
  const rows = [
    ["Total (parsed)", ...results.map((r) => `${toKB(r.totalParsed)} KB`)],
    ["Total (gzip)", ...results.map((r) => `${toKB(r.totalGzip)} KB`)],
    ["Total (brotli)", ...results.map((r) => `${toKB(r.totalBrotli)} KB`)],
    ["JS (parsed)", ...results.map((r) => `${toKB(r.jsParsed)} KB`)],
    ["JS (gzip)", ...results.map((r) => `${toKB(r.jsGzip)} KB`)],
    ["CSS (parsed)", ...results.map((r) => `${toKB(r.cssParsed)} KB`)],
    ["CSS (gzip)", ...results.map((r) => `${toKB(r.cssGzip)} KB`)],
    ["node_modules", ...results.map((r) => `${toKB(r.nmSize)} KB`)],
    ["App code", ...results.map((r) => `${toKB(r.appSize)} KB`)],
  ];

  const widths = cols.map((c, i) => Math.max(c.length, ...rows.map((r) => r[i].length)) + 2);
  const hr = widths.map((w) => "-".repeat(w)).join("+");

  console.log("\n📦 Bundle Size Comparison\n");
  console.log(cols.map((c, i) => pad(c, widths[i])).join("|"));
  console.log(hr);
  for (const row of rows) console.log(row.map((c, i) => pad(c, widths[i])).join("|"));

  if (values.top) {
    console.log("\n📦 Top 5 Dependencies (parsed KB)\n");
    for (const r of results) {
      console.log(`  ${r.name}`);
      for (const [pkg, size] of r.top5) console.log(`    ${pad(toKB(size) + " KB", 10)} ${pkg}`);
    }
  }
}

// --- Run ---

if (runBuild) await buildAll();
if (runAnalyze) analyzeAll();
