export type FieldType = "text" | "number" | "boolean" | "select";

export interface FieldValidation {
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface FieldConfig {
  placeholder?: string;
  defaultValue?: string | number | boolean | Date;
  options?: string[];
  decimalPlaces?: number;
}

export interface VisibilityRule {
  field: string;
  operator: "equals" | "contains" | "filled";
  value?: string | number | boolean | Date;
}

export interface FieldSchema {
  id: string;
  label: string;
  name: string;
  type: FieldType;
  validation: FieldValidation;
  config: FieldConfig;
  logic: {
    visibleIf?: VisibilityRule;
  };
  status: "active" | "inactive";
  usageCount: number;
}
