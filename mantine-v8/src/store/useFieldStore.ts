import { create } from "zustand";
import { faker } from "@faker-js/faker";
import type { FieldSchema, FieldType } from "../types/schema";

interface FieldState {
  fields: FieldSchema[];
  selectedIds: Set<string>;
  searchQuery: string;
  sortBy: keyof FieldSchema | undefined;
  sortOrder: "asc" | "desc";

  setSearchQuery: (query: string) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelected: () => void;
  deactivateSelected: () => void;
  reorderFields: (oldIndex: number, newIndex: number) => void;
  addField: (field: FieldSchema) => void;
  setSort: (key: keyof FieldSchema) => void;
}

const generateMockFields = (count: number): FieldSchema[] => {
  const types: FieldType[] = ["text", "number", "boolean", "select"];

  return Array.from({ length: count }, () => {
    const type = faker.helpers.arrayElement(types);
    const label = faker.commerce.productName();
    return {
      id: faker.string.uuid(),
      label,
      name: faker.helpers.slugify(label).toLowerCase(),
      type,
      validation: {
        required: faker.datatype.boolean(),
        min: type === "number" ? faker.number.int({ min: 0, max: 100 }) : undefined,
        max: type === "number" ? faker.number.int({ min: 101, max: 1000 }) : undefined,
      },
      config: {
        placeholder: faker.lorem.sentence(),
        options:
          type === "select"
            ? [faker.word.adjective(), faker.word.adjective(), faker.word.adjective()]
            : undefined,
      },
      logic: {},
      status: faker.helpers.arrayElement(["active", "inactive"]),
      usageCount: faker.number.int({ min: 0, max: 500 }),
    };
  });
};

export const useFieldStore = create<FieldState>((set) => ({
  fields: generateMockFields(1000),
  selectedIds: new Set(),
  searchQuery: "",
  sortBy: undefined,
  sortOrder: "asc",

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleSelection: (id) =>
    set((state) => {
      const newSelection = new Set(state.selectedIds);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { selectedIds: newSelection };
    }),

  selectAll: () =>
    set((state) => ({
      selectedIds: new Set(state.fields.map((f) => f.id)),
    })),

  clearSelection: () => set({ selectedIds: new Set() }),

  deleteSelected: () =>
    set((state) => ({
      fields: state.fields.filter((f) => !state.selectedIds.has(f.id)),
      selectedIds: new Set(),
    })),

  deactivateSelected: () =>
    set((state) => ({
      fields: state.fields.map((f) =>
        state.selectedIds.has(f.id) ? { ...f, status: "inactive" } : f,
      ),
      selectedIds: new Set(),
    })),

  reorderFields: (oldIndex, newIndex) =>
    set((state) => {
      const newFields = [...state.fields];
      const [removed] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, removed);
      return { fields: newFields };
    }),

  addField: (field) =>
    set((state) => ({
      fields: [field, ...state.fields],
    })),

  setSort: (key) =>
    set((state) => {
      const isSameKey = state.sortBy === key;
      const newOrder = isSameKey && state.sortOrder === "asc" ? "desc" : "asc";

      const sortedFields = [...state.fields].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal === bVal) {
          return 0;
        }
        if (aVal === undefined) {
          return 1;
        }
        if (bVal === undefined) {
          return -1;
        }

        const comparison = aVal < bVal ? -1 : 1;
        return newOrder === "asc" ? comparison : -comparison;
      });

      return {
        sortBy: key,
        sortOrder: newOrder,
        fields: sortedFields,
      };
    }),
}));
