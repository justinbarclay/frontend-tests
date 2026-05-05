import { useState, useMemo, useEffect } from "react";
import {
  Table,
  Checkbox,
  Badge,
  Group,
  TextInput,
  Button,
  Pagination,
  Paper,
  Title,
  ActionIcon,
  Modal,
  Text,
  Transition,
  Box,
} from "@mantine/core";
import { Search, Plus, Trash2, ShieldOff, GripVertical, ArrowUpDown } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
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

import { useFieldStore } from "../store/useFieldStore";
import type { FieldSchema } from "../types/schema";
import { BuilderDrawer } from "../components/BuilderDrawer";
import { SummaryBar } from "../components/SummaryBar";

const ITEMS_PER_PAGE = 50;

interface SortableRowProps {
  field: FieldSchema;
  selected: boolean;
  onSelect: () => void;
}

const SortableRow = ({ field, selected, onSelect }: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
    backgroundColor: isDragging
      ? "var(--mantine-color-blue-0)"
      : selected
        ? "var(--mantine-color-blue-light)"
        : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Table.Tr ref={setNodeRef} style={style}>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            style={{ cursor: "grab" }}
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </ActionIcon>
          <Checkbox checked={selected} onChange={onSelect} />
        </Group>
      </Table.Td>
      <Table.Td fw={500}>{field.label}</Table.Td>
      <Table.Td c="dimmed">
        <Text size="sm">{field.name}</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="outline" size="sm">
          {field.type}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={field.status === "active" ? "green" : "gray"} variant="light">
          {field.status}
        </Badge>
      </Table.Td>
      <Table.Td ta="right">{field.usageCount}</Table.Td>
    </Table.Tr>
  );
};

export const FieldLedger = () => {
  const {
    fields,
    searchQuery,
    setSearchQuery,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    deleteSelected,
    deactivateSelected,
    setSort,
    reorderFields,
    setFields,
  } = useFieldStore();

  useEffect(() => {
    fetch("/mock-fields.json")
      .then((res) => res.json())
      .then((data) => setFields(data));
  }, [setFields]);

  const [page, setPage] = useState(1);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [builderOpened, { open: openBuilder, close: closeBuilder }] = useDisclosure(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredFields = useMemo(
    () =>
      fields.filter(
        (f) =>
          f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [fields, searchQuery],
  );

  const paginatedFields = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredFields.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFields, page]);

  const totalPages = Math.ceil(filteredFields.length / ITEMS_PER_PAGE);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      reorderFields(oldIndex, newIndex);
    }
  };

  return (
    <Box pos="relative" pb={80}>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Field Ledger</Title>
        <Button leftSection={<Plus size={16} />} onClick={openBuilder}>
          New Field
        </Button>
      </Group>

      <SummaryBar />

      <Paper withBorder p="md" radius="md" mb="md">
        <TextInput
          placeholder="Search by label or name..."
          leftSection={<Search size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </Paper>

      <Paper withBorder radius="md">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={80}>
                  <Checkbox
                    onChange={(e) => (e.currentTarget.checked ? selectAll() : clearSelection())}
                    indeterminate={selectedIds.size > 0 && selectedIds.size < fields.length}
                    checked={selectedIds.size === fields.length}
                  />
                </Table.Th>
                <Table.Th onClick={() => setSort("label")} style={{ cursor: "pointer" }}>
                  <Group gap="xs">
                    Label <ArrowUpDown size={14} />
                  </Group>
                </Table.Th>
                <Table.Th onClick={() => setSort("name")} style={{ cursor: "pointer" }}>
                  <Group gap="xs">
                    Name <ArrowUpDown size={14} />
                  </Group>
                </Table.Th>
                <Table.Th onClick={() => setSort("type")} style={{ cursor: "pointer" }}>
                  <Group gap="xs">
                    Type <ArrowUpDown size={14} />
                  </Group>
                </Table.Th>
                <Table.Th onClick={() => setSort("status")} style={{ cursor: "pointer" }}>
                  <Group gap="xs">
                    Status <ArrowUpDown size={14} />
                  </Group>
                </Table.Th>
                <Table.Th
                  onClick={() => setSort("usageCount")}
                  style={{ cursor: "pointer" }}
                  ta="right"
                >
                  <Group gap="xs" justify="flex-end">
                    Usage <ArrowUpDown size={14} />
                  </Group>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <SortableContext
                items={paginatedFields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {paginatedFields.map((field) => (
                  <SortableRow
                    key={field.id}
                    field={field}
                    selected={selectedIds.has(field.id)}
                    onSelect={() => toggleSelection(field.id)}
                  />
                ))}
              </SortableContext>
            </Table.Tbody>
          </Table>
        </DndContext>
      </Paper>

      <Group justify="center" mt="xl">
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>

      <Transition
        mounted={selectedIds.size > 0}
        transition="slide-up"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Paper
            shadow="xl"
            p="md"
            withBorder
            pos="fixed"
            bottom={20}
            left="50%"
            style={{ ...styles, transform: "translateX(-50%)", zIndex: 100, width: "fit-content" }}
            radius="md"
            bg="var(--mantine-color-body)"
          >
            <Group>
              <Text size="sm" fw={500}>
                {selectedIds.size} rows selected
              </Text>
              <Button
                variant="light"
                color="gray"
                leftSection={<ShieldOff size={16} />}
                onClick={deactivateSelected}
              >
                Deactivate
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<Trash2 size={16} />}
                onClick={openDeleteModal}
              >
                Delete
              </Button>
            </Group>
          </Paper>
        )}
      </Transition>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        centered
      >
        <Text size="sm">
          Are you sure you want to delete {selectedIds.size} selected fields? This action cannot be
          undone.
        </Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              deleteSelected();
              closeDeleteModal();
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>

      <BuilderDrawer opened={builderOpened} onClose={closeBuilder} />
    </Box>
  );
};
