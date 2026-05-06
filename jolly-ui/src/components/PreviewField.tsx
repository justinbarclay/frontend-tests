import { useBuilderStore } from "../store/useBuilderStore";
import type { FieldSchema } from "../types/schema";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { JollySelect, SelectItem } from "./ui/select";
import { JollyNumberField } from "./ui/numberfield";
import { JollyTextField } from "./ui/textfield";

const NumberPreview = ({ field }: { field: FieldSchema }) => {
  const [value, setValue] = useState<number>(NaN);

  const error =
    field.validation.required && isNaN(value) ? "This field is required" : undefined;

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
        isRequired={field.validation.required}
        isDisabled={field.status === "inactive"}
        isInvalid={!!error}
        value={value}
        onChange={setValue}
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
        isRequired={field.validation.required}
        isDisabled={field.status === "inactive"}
        isInvalid={error}
        errorMessage={"Invalid format"}
      />
    </div>
  );
};

const SelectPreview = ({ field }: { field: FieldSchema }) => (
  <JollySelect
    label={field.label}
    placeholder={field.config.placeholder || "Select an option"}
    isRequired={field.validation.required}
    isDisabled={field.status === "inactive"}
  >
    {(field.config.options || []).map((option) => (
      <SelectItem key={option} id={option}>
        {option}
      </SelectItem>
    ))}
  </JollySelect>
);
const BooleanPreview = ({ field }: { field: FieldSchema }) => {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      isSelected={checked}
      onChange={setChecked}
      isDisabled={field.status === "inactive"}
    >
      {field.label}
    </Switch>
  );
};
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
