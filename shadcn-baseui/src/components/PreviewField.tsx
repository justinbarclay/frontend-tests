import { useBuilderStore } from "../store/useBuilderStore";
import type { FieldSchema } from "../types/schema";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const NumberPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<string>("");
  let renderValue = value;

  // Format value only for display if decimalPlaces is set and we have a value
  if (field.config.decimalPlaces !== undefined && value !== "") {
    const num = Number(value);
    if (!isNaN(num)) {
      renderValue = num.toFixed(field.config.decimalPlaces);
    }
  }

  // Handle required error
  const error = field.validation.required && value === "" ? "This field is required" : undefined;

  return (
    <Field className="max-w-md" data-invalid={!!error}>
      <FieldLabel>{field.label}</FieldLabel>
      <Input
        placeholder={field.config.placeholder || "Enter a number"}
        type="number"
        max={field.validation.max}
        min={field.validation.min}
        onChange={(event) => {
          const val = event.currentTarget.value;
          // Prevent update if alphabetical characters are present
          if (!/[a-zA-Z]/.test(val)) {
            setValue(val);
          }
        }}
        value={value} // Use raw value for input to allow typing decimals freely
        aria-invalid={!!error}
      />
       {field.config.decimalPlaces !== undefined && value !== "" && !isNaN(Number(value)) && (
        <p className="text-xs text-muted-foreground mt-1">
          Formatted: {renderValue}
        </p>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

const TextPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<string>("");
  const error= field.validation.pattern ? !new RegExp(field.validation.pattern).test(value) : false;
  return (
    <Field className="max-w-md" data-invalid={error}>
      <FieldLabel>{field.label}</FieldLabel>
      <Input
        placeholder={field.config.placeholder || "Enter text"}
        onChange={(event) => setValue(event.currentTarget.value)}
        value={value}
        aria-invalid={error}
      />
      {error && <FieldError>Field does not match regex pattern</FieldError>}
    </Field>

  );
};

const SelectPreview = ({ field }: { field: FieldSchema }) => (
  <Field className="max-w-md">
    <FieldLabel>{field.label}</FieldLabel>
    <Select
      defaultValue={field.config.placeholder as string}>
      <SelectTrigger>
        <SelectValue>{field.config.placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {field.config.options?.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </Field>
);

const BooleanPreview = ({ field }: { field: FieldSchema }) => (
  <Field className="max-w-md">
    <FieldLabel>{field.label}</FieldLabel>
  <Switch
    defaultChecked={(field.config.defaultValue as boolean) || false}
  />
  </Field>
);
const preview = {
  number: (field: FieldSchema) => <NumberPreview field={field} />,
  text: (field: FieldSchema) => <TextPreview field={field} />,
  select: (field: FieldSchema) => <SelectPreview field={field} />,
  boolean: (field: FieldSchema) => <BooleanPreview field={field} />,
};

const Preview = () => {
  const field = useBuilderStore((state) => state.field);

  if (!field) {
    return <div className="p-4 text-gray-500">Select a field to preview</div>;
  }
  const renderPreview = preview[field.type];
  if (!renderPreview) {
    return <div className="p-4 text-gray-500">No preview available for this field type</div>;
  }
  return renderPreview(field);
};

export default Preview;
