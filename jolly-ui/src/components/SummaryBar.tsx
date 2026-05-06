import { useFieldStore } from "@/store/useFieldStore";

export function SummaryBar() {
  const fields = useFieldStore((state) => state.fields);
  const totalFields = fields.length;
  const activeFields = fields.filter((f) => f.status === "active").length;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Total Fields
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
              {totalFields.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">Total</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      </div>

      <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Active Fields
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
              {activeFields.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">Active</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
      </div>
    </div>
  );
}
