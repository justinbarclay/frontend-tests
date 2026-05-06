import { NumberInput, Select, Switch, TextInput } from "@mantine/core";
import { useBuilderStore } from "../store/useBuilderStore";
import type { FieldSchema } from "../types/schema";
import { useState } from "react";

const NumberPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<string>("");
  let renderValue = value?.toString();
  if (field.config.decimalPlaces !== undefined && value) {
    renderValue = Number(value).toFixed(field.config.decimalPlaces) || "0";
  }
  return (
    <NumberInput
      label={field.label}
      placeholder={field.config.placeholder || "Enter a number"}
      max={field.validation.max}
      min={field.validation.min}
      onChange={(val) => setValue(val.toString())}
      value={renderValue}
    />
  );
};

const TextPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<string>("");
  return (
    <TextInput
      label={field.label}
      placeholder={field.config.placeholder || "Enter text"}
      onChange={(event) => setValue(event.currentTarget.value)}
      value={value}
      error={
        field.validation.pattern && !new RegExp(field.validation.pattern).test(value)
          ? "Invalid format"
          : null}
    />
  );
};

const SelectPreview = ({ field }: { field: FieldSchema }) => (
  <Select
    label={field.label}
    placeholder={field.config.placeholder || "Select an option"}
    data={field.config.options || []}
  />
);
const BooleanPreview = ({ field }: { field: FieldSchema }) => (
  <Switch
    label={field.label}
    onLabel="True"
    offLabel="False"
    defaultChecked={(field.config.defaultValue as boolean) || false}
  />
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
