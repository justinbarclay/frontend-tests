import React, { useEffect, useMemo } from "react";
import { JollyTextField as TextField } from "@/components/ui/textfield";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useFieldStore } from "@/store/useFieldStore";
import { SummaryBar } from "@/components/SummaryBar";
import { BulkActionBar } from "@/components/BulkActionBar";
import { TableVirtuoso } from "react-virtuoso";
import { Button, DialogTrigger } from "react-aria-components";
import { Plus, GripVertical, ArrowUpDown } from "lucide-react";
import { BuilderDrawer } from "./BuilderDrawer";
import { cn } from "@/lib/utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Custom sortable row that correctly forwards refs for both Virtuoso and dnd-kit
const SortableVirtuosoRow = ({ item, ...props }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
  };

  const mergedRef = (node: any) => {
    setNodeRef(node);
    if (props.ref) {
      if (typeof props.ref === "function") props.ref(node);
      else props.ref.current = node;
    }
  };

  return (
    <tr
      {...props}
      ref={mergedRef}
      style={{ ...props.style, ...style }}
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        isDragging && "bg-muted shadow-sm",
        props.className
      )}
    >
      <td className="w-10 p-4 align-middle">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
      </td>
      {props.children}
    </tr>
  );
};

export function FieldLedger() {
  const {
    fields,
    setFields,
    searchQuery,
    setSearchQuery,
    setSort,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    reorderFields,
  } = useFieldStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetch("/mock-fields.json")
      .then((res) => res.json())
      .then((data) => setFields(data));
  }, [setFields]);

  const filteredFields = useMemo(() => {
    return fields.filter(
      (f) =>
        f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [fields, searchQuery]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      reorderFields(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-6">
      <SummaryBar />

      <div className="flex items-center justify-between gap-4">
        <TextField
          placeholder="Search fields by label or name..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="max-w-md flex-1"
        />
        <DialogTrigger>
          <Button 
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Plus className="size-4" />
            New Field
          </Button>
          <BuilderDrawer />
        </DialogTrigger>
      </div>

      <div className="rounded-md border bg-card">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredFields.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <TableVirtuoso
              style={{ height: "600px" }}
              data={filteredFields}
              components={{
                Table: (props) => <table {...props} className="w-full caption-bottom text-sm" />,
                TableHead: React.forwardRef((props, ref) => <thead {...props} ref={ref} className="[&_tr]:border-b bg-background sticky top-0 z-20 shadow-sm" />),
                TableBody: React.forwardRef((props, ref) => <tbody {...props} ref={ref} className="[&_tr:last-child]:border-0" />),
                TableRow: SortableVirtuosoRow,
              }}
              fixedHeaderContent={() => (
                <tr>
                  <th className="w-10 p-4 align-middle"></th>
                  <th className="w-14 p-4 align-middle">
                    <Checkbox
                      isSelected={selectedIds.size === fields.length && fields.length > 0}
                      isIndeterminate={selectedIds.size > 0 && selectedIds.size < fields.length}
                      onChange={(isSelected) => {
                        if (isSelected) selectAll();
                        else clearSelection();
                      }}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <button onClick={() => setSort("label")} className="flex items-center gap-1 hover:text-foreground">
                      Label <ArrowUpDown className="size-3"/>
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <button onClick={() => setSort("name")} className="flex items-center gap-1 hover:text-foreground">
                      Name <ArrowUpDown className="size-3"/>
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Usage</th>
                </tr>
              )}
              itemContent={(_index, field) => (
                <>
                  <td className="w-14 p-4 align-middle">
                    <Checkbox
                      isSelected={selectedIds.has(field.id)}
                      onChange={() => toggleSelection(field.id)}
                      aria-label={`Select ${field.label}`}
                    />
                  </td>
                  <td className="p-4 align-middle font-medium">{field.label}</td>
                  <td className="p-4 align-middle font-mono text-xs text-muted-foreground">{field.name}</td>
                  <td className="p-4 align-middle">
                    <Badge variant="secondary" className="capitalize">{field.type}</Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant={field.status === "active" ? "success" : "secondary"}>{field.status}</Badge>
                  </td>
                  <td className="p-4 align-middle text-right tabular-nums">{field.usageCount}</td>
                </>
              )}
            />
          </SortableContext>
        </DndContext>
      </div>

      <BulkActionBar />
    </div>
  );
}
