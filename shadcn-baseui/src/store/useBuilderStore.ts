import { create } from "zustand";
import type {
  FieldSchema,
  FieldType,
  FieldValidation,
  FieldConfig,
  VisibilityRule,
} from "../types/schema";
import { slugify } from "@/lib/utils";

interface BuilderState {
  field: FieldSchema;

  // Field setters (replace useReducer actions)
  updateRoot: (key: keyof FieldSchema, value: any) => void;
  updateValidation: (key: keyof FieldValidation, value: any) => void;
  updateConfig: (key: keyof FieldConfig, value: any) => void;
  updateLogic: (key: keyof VisibilityRule, value: any) => void;
  setType: (type: FieldType) => void;

  // Reset for when the drawer opens/closes
  reset: (initialField?: FieldSchema) => void;
}

const defaultField: Omit<FieldSchema, "id"> = {
  label: "",
  name: "",
  type: "text",
  validation: { required: false },
  config: { placeholder: "" },
  logic: {},
  status: "active",
  usageCount: 0,
};

export const useBuilderStore = create<BuilderState>((set) => ({
  field: { ...defaultField, id: crypto.randomUUID() } as FieldSchema,

  updateRoot: (key, value) =>
    set((state) => {
      if (
        key === "label" &&
        (state.field.name.length === 0 || state.field.name === slugify(state.field.label))
      ) {
        return { field: { ...state.field, [key]: value, name: slugify(value) } };
      } else {
        return { field: { ...state.field, [key]: value } };
      }
    }),

  updateValidation: (key, value) =>
    set((state) => ({
      field: {
        ...state.field,
        validation: { ...state.field.validation, [key]: value },
      },
    })),

  updateConfig: (key, value) =>
    set((state) => ({
      field: {
        ...state.field,
        config: { ...state.field.config, [key]: value },
      },
    })),

  updateLogic: (key, value) =>
    set((state) => ({
      field: {
        ...state.field,
        logic: {
          ...state.field.logic,
          visibleIf: {
            ...(state.field.logic.visibleIf || { field: "", operator: "equals" }),
            [key]: value,
          } as VisibilityRule,
        },
      },
    })),

  setType: (type) =>
    set((state) => ({
      field: {
        ...state.field,
        type,
        // Reset type-specific validations and config, keep global ones
        validation: { required: state.field.validation.required },
        config: { placeholder: state.field.config.placeholder, defaultValue: undefined },
      },
    })),

  reset: (initialField) =>
    set({
      field: initialField || ({ ...defaultField, id: crypto.randomUUID() } as FieldSchema),
    }),
}));
