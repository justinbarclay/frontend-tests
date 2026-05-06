import { useBuilderStore } from "../store/useBuilderStore";
import type { FieldSchema } from "../types/schema";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/field";
import { JollySelect, SelectItem } from "./ui/select";
import { JollyNumberField } from "./ui/numberfield";
import { JollyTextField } from "./ui/textfield";

const NumberPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<string>("");

  // Handle required error
  const error = field.validation.required && value === "" ? "This field is required" : undefined;

  return (
    <div className="flex flex-col gap-1">
      <JollyNumberField
        label={field.label}
        description={field.config.placeholder || "Enter a number"}
        maxValue={field.validation.max}
        minValue={field.validation.min}
        formatOptions={{
          minimumFractionDigits: field.config.decimalPlaces || 0,
          maximumFractionDigits: field.config.decimalPlaces || 0,
        }}
        isInvalid={!!error}
        onChange={(val) => setValue(val.toString())}
        errorMessage={error}
      />
    </div>
  );
};

const TextPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<string>("");
  let error = false;
  if (value && field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
    error = true;
  }
  return (
    <div className="flex flex-col gap-1">
      <JollyTextField
        label={field.label}
        placeholder={field.config.placeholder || "Enter text"}
        onChange={(val) => setValue(val)}
        value={value}
        isInvalid={error}
        errorMessage={"Invalid format"}
      />
    </div>
  );
};

const SelectPreview = ({ field }: { field: FieldSchema }) => (
  <JollySelect label={field.label} placeholder={field.config.placeholder || "Select an option"}>
    {(field.config.options || []).map((option) => (
      <SelectItem key={option} id={option}>
        {option}
      </SelectItem>
    ))}
  </JollySelect>
);
const BooleanPreview = ({ field }: { field: FieldSchema }) => (
  <div className="flex items-center space-x-2">
    <Label>{field.label}</Label>
    <Switch onChange={() => {}} />
  </div>
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
