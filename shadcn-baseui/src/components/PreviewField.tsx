import { useBuilderStore } from "@/store/useBuilderStore";
import type { FieldSchema } from "@/types/schema";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NumberPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<string>("");

  const formattedValue =
    field.config.decimalPlaces !== undefined && value !== "" && !isNaN(Number(value))
      ? Number(value).toFixed(field.config.decimalPlaces)
      : null;

  const error = field.validation.required && value === "" ? "This field is required" : undefined;

  return (
    <Field className="max-w-md" data-invalid={!!error}>
      <FieldLabel>{field.label}</FieldLabel>
      <Input
        placeholder={field.config.placeholder || "Enter a number"}
        type="number"
        max={field.validation.max}
        min={field.validation.min}
        required={field.validation.required}
        onChange={(event) => {
          const val = event.currentTarget.value;
          if (!/[a-zA-Z]/.test(val)) {
            setValue(val);
          }
        }}
        value={value}
        aria-invalid={!!error}
      />
      {formattedValue !== null && (
        <p className="text-xs text-muted-foreground mt-1">Formatted: {formattedValue}</p>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

const TextPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const error =
    touched && field.validation.pattern
      ? !new RegExp(field.validation.pattern).test(value)
      : false;

  return (
    <Field className="max-w-md" data-invalid={error}>
      <FieldLabel>{field.label}</FieldLabel>
      <Input
        placeholder={field.config.placeholder || "Enter text"}
        onChange={(event) => setValue(event.currentTarget.value)}
        onBlur={() => setTouched(true)}
        value={value}
        required={field.validation.required}
        aria-invalid={error}
      />
      {error && <FieldError>Field does not match regex pattern</FieldError>}
    </Field>
  );
};

const SelectPreview = ({ field }: { field: FieldSchema }) => (
  <Field className="max-w-md">
    <FieldLabel>{field.label}</FieldLabel>
    <Select>
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
    <Switch defaultChecked={(field.config.defaultValue as boolean) || false} />
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
