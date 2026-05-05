"use client"

import { useFieldStore } from "@/store/use-field-store"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2Icon, BanIcon, XIcon } from "lucide-react"
import { toast } from "@/lib/toast"

export function ActionBar() {
  const { selectedIds, toggleSelectAll, deleteFields, deactivateFields } =
    useFieldStore()

  const selectedCount = selectedIds.size

  if (selectedCount === 0) return null

  const handleDeactivate = () => {
    deactivateFields(Array.from(selectedIds))
    toast({
      title: "Fields deactivated",
      description: `${selectedCount} fields have been set to inactive.`,
    })
  }

  const handleDelete = () => {
    deleteFields(Array.from(selectedIds))
    toast({
      title: "Fields deleted",
      description: `${selectedCount} fields have been permanently removed.`,
    })
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border bg-background px-6 py-3 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
      <div className="flex items-center gap-2 border-r pr-4 mr-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {selectedCount}
        </span>
        <span className="text-sm font-medium">Selected</span>
        <Button
          variant="ghost"
          size="icon-xs"
          className="ml-1 h-6 w-6 rounded-full"
          onClick={() => toggleSelectAll([])}
          aria-label="Clear selection"
        >
          <XIcon className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-full"
          onClick={handleDeactivate}
        >
          <BanIcon className="h-4 w-4" />
          Deactivate
        </Button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="destructive"
                size="sm"
                className="h-9 gap-2 rounded-full"
              >
                <Trash2Icon className="h-4 w-4" />
                Delete
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the{" "}
                {selectedCount} selected fields and remove their data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
