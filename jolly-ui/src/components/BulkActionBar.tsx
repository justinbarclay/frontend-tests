import { useFieldStore } from "@/store/useFieldStore";
import { Button } from "@/components/ui/button";
import { Trash2, ShieldOff, X } from "lucide-react";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export function BulkActionBar() {
  const { selectedIds, clearSelection, deleteSelected, deactivateSelected } = useFieldStore();
  const count = selectedIds.size;

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border bg-background px-6 py-3 shadow-2xl animate-in slide-in-from-bottom-10">
      <div className="flex items-center gap-2 border-r pr-4">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {count}
        </span>
        <span className="text-sm font-medium">Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onPress={deactivateSelected}
        >
          <ShieldOff className="size-4" />
          Deactivate
        </Button>

        <DialogTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <DialogContent role="alertdialog">
            {({ close }) => (
              <>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete {count} selected
                    field{count > 1 ? "s" : ""}.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onPress={close}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onPress={() => {
                      deleteSelected();
                      close();
                    }}
                  >
                    Delete {count} Field{count > 1 ? "s" : ""}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </DialogTrigger>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="ml-2 size-8 rounded-full"
        onPress={clearSelection}
      >
        <X className="size-4" />
        <span className="sr-only">Clear selection</span>
      </Button>
    </div>
  );
}
