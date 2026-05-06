"use client";

import * as React from "react";
import { useFieldStore, type Field } from "@/store/useFieldStore";
import { TableVirtuoso } from "react-virtuoso";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDownIcon, SearchIcon, PlusIcon, GripVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SummaryBar } from "@/components/summary-bar";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Context to pass DND attributes from row to drag handle
const SortableRowContext = React.createContext<{
  attributes: any;
  listeners: any;
  setNodeRef: (node: HTMLElement | null) => void;
} | null>(null);

const useSortableRow = () => {
  const context = React.useContext(SortableRowContext);
  if (!context) {
    throw new Error("useSortableRow must be used within a SortableRowProvider");
  }
  return context;
};

const DataTableRow = ({
  item,
  selectedIds,
  ...props
}: {
  item: Field;
  selectedIds: Set<string>;
  [key: string]: any;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const contextValue = React.useMemo(
    () => ({ attributes, listeners, setNodeRef }),
    [attributes, listeners, setNodeRef],
  );

  return (
    <SortableRowContext.Provider value={contextValue}>
      <TableRow
        {...props}
        ref={setNodeRef}
        style={style}
        data-state={selectedIds.has(item.id) ? "selected" : undefined}
        className={cn(props.className, isDragging && "opacity-50 z-50")}
      >
        {props.children}
      </TableRow>
    </SortableRowContext.Provider>
  );
};

const DragHandle = () => {
  const { attributes, listeners } = useSortableRow();
  return (
    <div
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
    >
      <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export function FieldLedger() {
  const {
    fields,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSort,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    setIsBuilderOpen,
    reorderFields,
  } = useFieldStore();

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredAndSortedFields = React.useMemo(() => {
    let result = [...fields].filter(
      (f) =>
        f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [fields, searchQuery, sortConfig]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(oldIndex, newIndex);
      }
    }

    setActiveId(null);
  };

  const allSelected =
    filteredAndSortedFields.length > 0 &&
    filteredAndSortedFields.every((f) => selectedIds.has(f.id));

  const activeField = React.useMemo(
    () => fields.find((f) => f.id === activeId),
    [fields, activeId],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Field Ledger</h2>
        <Button onClick={() => setIsBuilderOpen(true)} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          New Field
        </Button>
      </div>

      <SummaryBar />

      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search fields by label or name..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
          <SortableContext
            items={filteredAndSortedFields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <TableVirtuoso
              style={{ height: "600px" }}
              data={filteredAndSortedFields}
              components={{
                Table: ({ ...props }) => <Table {...props} />,
                TableBody: React.forwardRef(({ ...props }, ref) => (
                  <TableBody {...props} ref={ref} />
                )),
                TableRow: (props) => {
                  const index = props["data-index"];
                  const field = filteredAndSortedFields[index];
                  if (!field) return <TableRow {...props} />;
                  return <DataTableRow {...props} item={field} selectedIds={selectedIds} />;
                },
              }}
              fixedHeaderContent={() => (
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() =>
                        toggleSelectAll(filteredAndSortedFields.map((f) => f.id))
                      }
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 gap-1"
                      onClick={() => setSort("label")}
                    >
                      Label
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 gap-1"
                      onClick={() => setSort("name")}
                    >
                      Name
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 gap-1"
                      onClick={() => setSort("type")}
                    >
                      Type
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 gap-1"
                      onClick={() => setSort("status")}
                    >
                      Status
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 gap-1 ml-auto"
                      onClick={() => setSort("usageCount")}
                    >
                      Usage
                      <ArrowUpDownIcon className="h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              )}
              itemContent={(_, field) => (
                <>
                  <TableCell className="w-[40px]">
                    <DragHandle />
                  </TableCell>
                  <TableCell className="w-[40px]">
                    <Checkbox
                      checked={selectedIds.has(field.id)}
                      onCheckedChange={() => toggleSelection(field.id)}
                      aria-label={`Select ${field.label}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{field.label}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{field.name}</code>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{field.type}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={field.status === "active" ? "default" : "secondary"}
                      className={cn(
                        field.status === "active"
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 dark:bg-green-500/20"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {field.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{field.usageCount.toLocaleString()}</TableCell>
                </>
              )}
            />
          </SortableContext>
        </div>

        <DragOverlay>
          {activeField ? (
            <Table className="border rounded-md bg-background shadow-xl">
              <TableBody>
                <TableRow className="bg-muted/50">
                  <TableCell className="w-[40px]">
                    <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="w-[40px]">
                    <Checkbox checked={selectedIds.has(activeField.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{activeField.label}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{activeField.name}</code>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{activeField.type}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={activeField.status === "active" ? "default" : "secondary"}>
                      {activeField.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {activeField.usageCount.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
