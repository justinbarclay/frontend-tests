import { create } from "zustand";
import type { FieldSchema } from "../types/schema";

interface FieldState {
  fields: FieldSchema[];
  selectedIds: Set<string>;
  searchQuery: string;
  sortBy: keyof FieldSchema | undefined;
  sortOrder: "asc" | "desc";

  setFields: (fields: FieldSchema[]) => void;
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

export const useFieldStore = create<FieldState>((set) => ({
  fields: [],
  selectedIds: new Set(),
  searchQuery: "",
  sortBy: undefined,
  sortOrder: "asc",

  setFields: (fields) => set({ fields }),
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
