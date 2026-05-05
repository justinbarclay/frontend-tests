"use client"

import { useFieldStore } from "@/store/use-field-store"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export function FieldBuilder() {
  const { isBuilderOpen, setIsBuilderOpen } = useFieldStore()

  return (
    <Sheet open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
      <SheetContent side="right" className="flex flex-col p-0 sm:max-w-4xl">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>New Field</SheetTitle>
          <SheetDescription>
            Configure your custom field properties and validation rules.
          </SheetDescription>
        </SheetHeader>

        <Separator className="mt-4" />

        <div className="flex flex-1 overflow-hidden">
          {/* Editor Panel (Left) */}
          <div className="flex-1 overflow-y-auto p-6 border-r">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              Editor
            </h3>
            <div className="space-y-6">
              <div className="rounded-lg border-2 border-dashed p-12 text-center">
                <p className="text-muted-foreground italic">
                  TODO: Developer Implementation [manual]

                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Implement conditional form state for Label, Name, Type, etc.
                </p>
              </div>
            </div>
          </div>

          {/* Preview Panel (Right) */}
          <div className="w-80 overflow-y-auto p-6 bg-muted/30">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              Preview
            </h3>
            <div className="space-y-6">
               <div className="rounded-lg border-2 border-dashed p-12 text-center bg-background">
                <p className="text-muted-foreground italic">
                  TODO: Developer Implementation [manual]
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Implement real-time component preview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
