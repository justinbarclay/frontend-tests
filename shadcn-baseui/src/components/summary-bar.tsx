"use client"

import { useFieldStore } from "@/store/use-field-store"
import { DatabaseIcon, CheckCircle2Icon } from "lucide-react"

export function SummaryBar() {
  const fields = useFieldStore((state) => state.fields)
  
  const totalFields = fields.length
  const activeFields = fields.filter((f) => f.status === "active").length

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/10 via-background to-primary/5 p-6 shadow-md border-primary/20">
      {/* Decorative background element */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative flex flex-wrap items-center gap-8 md:gap-16">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
            <DatabaseIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Fields
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {totalFields.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="hidden h-12 w-px bg-border md:block" />

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600 shadow-sm ring-1 ring-green-500/20 dark:text-green-500">
            <CheckCircle2Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Active Fields
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {activeFields.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="ml-auto hidden items-center gap-2 text-xs font-medium text-muted-foreground md:flex">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          System Live
        </div>
      </div>
    </div>
  )
}
