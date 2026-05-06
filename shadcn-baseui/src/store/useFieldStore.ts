import { create } from "zustand"
import { faker } from "@faker-js/faker"
import { slugify } from "@/lib/utils"

export type FieldType = "text" | "number" | "boolean" | "select"
export type FieldStatus = "active" | "inactive"

export interface Field {
  id: string
  label: string
  name: string
  type: FieldType
  status: FieldStatus
  usageCount: number
  validation: {
    required: boolean
    min?: number
    max?: number
    pattern?: string
  }
  config: {
    placeholder?: string
    defaultValue?: any
    options?: string[]
  }
}

interface FieldState {
  fields: Field[]
  searchQuery: string
  sortConfig: {
    key: keyof Field | null
    direction: "asc" | "desc"
  }
  selectedIds: Set<string>
  isBuilderOpen: boolean
  setSearchQuery: (query: string) => void
  setSort: (key: keyof Field) => void
  setIsBuilderOpen: (open: boolean) => void
  toggleSelection: (id: string) => void
  toggleSelectAll: (ids: string[]) => void
  deleteFields: (ids: string[]) => void
  deactivateFields: (ids: string[]) => void
  reorderFields: (startIndex: number, endIndex: number) => void
  addField: (field: Omit<Field, "id" | "usageCount">) => void
}

const generateMockFields = (count: number): Field[] => {
  return Array.from({ length: count }, () => {
    const label = faker.commerce.productName()
    return {
      id: faker.string.uuid(),
      label,
      name: slugify(label),
      type: faker.helpers.arrayElement(["text", "number", "boolean", "select"]),
      status: faker.helpers.arrayElement(["active", "inactive"]),
      usageCount: faker.number.int({ min: 0, max: 500 }),
      validation: {
        required: faker.datatype.boolean(),
      },
      config: {},
    }
  })
}

export const useFieldStore = create<FieldState>((set) => ({
  fields: generateMockFields(1000),
  searchQuery: "",
  sortConfig: {
    key: null,
    direction: "asc",
  },
  selectedIds: new Set(),
  isBuilderOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSort: (key) =>
    set((state) => ({
      sortConfig: {
        key,
        direction:
          state.sortConfig.key === key && state.sortConfig.direction === "asc"
            ? "desc"
            : "asc",
      },
    })),

  setIsBuilderOpen: (open) => set({ isBuilderOpen: open }),

  toggleSelection: (id) =>
    set((state) => {
      const newSelection = new Set(state.selectedIds)
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
      return { selectedIds: newSelection }
    }),

  toggleSelectAll: (ids) =>
    set((state) => {
      const allSelected = ids.every((id) => state.selectedIds.has(id))
      const newSelection = new Set(state.selectedIds)
      if (allSelected) {
        ids.forEach((id) => newSelection.delete(id))
      } else {
        ids.forEach((id) => newSelection.add(id))
      }
      return { selectedIds: newSelection }
    }),

  deleteFields: (ids) =>
    set((state) => ({
      fields: state.fields.filter((f) => !ids.includes(f.id)),
      selectedIds: new Set(
        Array.from(state.selectedIds).filter((id) => !ids.includes(id))
      ),
    })),

  deactivateFields: (ids) =>
    set((state) => ({
      fields: state.fields.map((f) => {
        if (ids.includes(f.id)) {
          return { ...f, status: "inactive" }
        }
        return f
      }),
      selectedIds: new Set(),
    })),

  reorderFields: (startIndex, endIndex) =>
    set((state) => {
      const newFields = [...state.fields]
      const [removed] = newFields.splice(startIndex, 1)
      newFields.splice(endIndex, 0, removed)
      return { fields: newFields }
    }),

  addField: (fieldData) =>
    set((state) => ({
      fields: [
        {
          ...fieldData,
          id: faker.string.uuid(),
          usageCount: 0,
        },
        ...state.fields,
      ],
    })),
}))
