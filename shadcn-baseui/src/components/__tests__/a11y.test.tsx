import { render } from "@testing-library/react";
import axe from "axe-core";
import { beforeEach, describe, expect, test } from "vitest";
import type { FieldSchema } from "../../types/schema";
import { useBuilderStore } from "../../store/useBuilderStore";
import ConfigurationForm from "../ConfigurationForm";
import Preview from "../PreviewField";

// Page-level axe rules that don't apply to component tests
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    "html-has-lang": { enabled: false },
    "landmark-one-main": { enabled: false },
    "page-has-heading-one": { enabled: false },
    region: { enabled: false },
    "document-title": { enabled: false },
  },
};

async function checkA11y(container: HTMLElement) {
  const results = await axe.run(container, AXE_OPTIONS);
  if (results.violations.length === 0) return;
  const message = results.violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description}\n` + v.nodes.map((n) => `  ${n.html}`).join("\n"),
    )
    .join("\n\n");
  expect.fail(`Accessibility violations:\n\n${message}`);
}

const base: FieldSchema = {
  id: "test-1",
  label: "Test Field",
  name: "testField",
  type: "text",
  validation: { required: false },
  config: { placeholder: "Enter a value" },
  logic: {},
  status: "active",
  usageCount: 0,
};

beforeEach(() => {
  useBuilderStore.setState({ field: { ...base } });
});

describe("ConfigurationForm", () => {
  test("text type", async () => {
    useBuilderStore.setState({
      field: { ...base, type: "text", validation: { required: false, pattern: ".*" } },
    });
    const { container } = render(<ConfigurationForm />);
    await checkA11y(container);
  });

  test("number type", async () => {
    useBuilderStore.setState({
      field: {
        ...base,
        type: "number",
        validation: { required: false, min: 0, max: 100 },
        config: { decimalPlaces: 2 },
      },
    });
    const { container } = render(<ConfigurationForm />);
    await checkA11y(container);
  });

  test("select type", async () => {
    useBuilderStore.setState({
      field: {
        ...base,
        type: "select",
        config: { options: ["Option A", "Option B"], placeholder: "Pick one" },
      },
    });
    const { container } = render(<ConfigurationForm />);
    await checkA11y(container);
  });

  test("boolean type", async () => {
    useBuilderStore.setState({ field: { ...base, type: "boolean" } });
    const { container } = render(<ConfigurationForm />);
    await checkA11y(container);
  });
});

describe("PreviewField", () => {
  test("text field", async () => {
    useBuilderStore.setState({
      field: { ...base, type: "text", validation: { required: true, pattern: "^[a-zA-Z]+$" } },
    });
    const { container } = render(<Preview />);
    await checkA11y(container);
  });

  test("number field", async () => {
    useBuilderStore.setState({
      field: {
        ...base,
        type: "number",
        validation: { required: true, min: 1, max: 99 },
        config: { decimalPlaces: 2 },
      },
    });
    const { container } = render(<Preview />);
    await checkA11y(container);
  });

  test("select field", async () => {
    useBuilderStore.setState({
      field: {
        ...base,
        type: "select",
        config: { options: ["Red", "Green", "Blue"], placeholder: "Pick a colour" },
      },
    });
    const { container } = render(<Preview />);
    await checkA11y(container);
  });

  test("boolean field", async () => {
    useBuilderStore.setState({
      field: { ...base, type: "boolean", config: { defaultValue: false } },
    });
    const { container } = render(<Preview />);
    await checkA11y(container);
  });
});
