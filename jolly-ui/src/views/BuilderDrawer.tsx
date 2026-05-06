import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/store/useBuilderStore";
import ConfigurationForm from "@/components/ConfigurationForm";
import Preview from "@/components/PreviewField";

export function BuilderDrawer() {
  const { field } = useBuilderStore();

  return (
    <DialogContent side="right" className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Field Architect</DialogTitle>
        <DialogDescription>
          Define the properties and validation for your custom field.
        </DialogDescription>
      </DialogHeader>

      <div className="flex h-full gap-6 py-6">
        {/* Editor Panel (Left) */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          <div className="rounded-lg border border-dashed p-8 text-center bg-muted/30">
            <p className="text-sm text-muted-foreground italic">
              <ConfigurationForm />
            </p>
          </div>
        </div>

        {/* Preview Panel (Right) */}
        <div className="w-[300px] flex flex-col border-l pl-6">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Live Preview
          </h4>
          <div className="flex min-h-[200px] items-center justify-center rounded-xl border-2 border-dashed bg-muted/50 p-6">
            <div className="w-full text-center">
              <p className="text-sm text-muted-foreground italic">
                <Preview />
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Schema Output
            </h4>
            <pre className="max-h-[300px] overflow-auto rounded-lg bg-zinc-950 p-4 text-[10px] text-zinc-400">
              {JSON.stringify(field, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline">Cancel</Button>
        <Button>Save Field</Button>
      </div>
    </DialogContent>
  );
}
