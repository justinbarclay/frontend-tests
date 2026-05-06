import type { FieldType } from "../types/schema";
import { useBuilderStore } from "../store/useBuilderStore";
import { useState } from "react";
import { JollyTextField } from "./ui/textfield";
import { JollySelect, SelectItem } from "./ui/select";
import { JollyNumberField } from "./ui/numberfield";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

const TextConfigurator = () => {
  const field = useBuilderStore((state) => state.field);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  return (
    <div className="grid grid-cols-2 gap-4">
      <JollyTextField
        className="col-span-2"
        label="Pattern"
        placeholder="Regex pattern"
        key="pattern"
        value={field.validation.pattern}
        onChange={(value) => updateValidation("pattern", value)}
      />
    </div>
  );
};

const NumberConfigurator = () => {
  const field = useBuilderStore((state) => state.field);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  const updateConfig = useBuilderStore((state) => state.updateConfig);
  return (
    <div className="grid grid-cols-2 gap-4">
      <JollyNumberField
        className="col-span-2"
        label="Min"
        description="Set min"
        key="min"
        value={field.validation.min}
        onChange={(value) => updateValidation("min", value)}
      />
      <JollyNumberField
        className="col-span-2"
        label="Max"
        description="Set max"
        key="max"
        value={field.validation.max}
        onChange={(value) => updateValidation("max", value)}
      />
      <JollyNumberField
        className="col-span-2"
        label="Decimal Places"
        description={"2"}
        key="decimal-places"
        value={field.config.decimalPlaces || 2}
        onChange={(value) => updateConfig("decimalPlaces", value)}
      />
    </div>
  );
};

const SelectConfigurator = () => {
  const [newValue, setValue] = useState("");
  const field = useBuilderStore((state) => state.field);
  const updateConfig = useBuilderStore((state) => state.updateConfig);

  return (
    <div className="grid grid-cols-2 gap-4">
      {field.config.options?.map((option, index) => (
        <JollyTextField
          className="col-span-2"
          label={`Option ${index + 1}`}
          placeholder={`Option ${index + 1}`}
          key={`option-${index}`}
          value={option}
          onChange={(value) => {
            const newOptions = [...(field.config.options || [])];
            newOptions[index] = value;
            updateConfig("options", newOptions);
          }}
        />
      ))}
      {/* New Option Input with button*/}
      <div className="col-span-2 flex items-end gap-2 mt-2">
        <JollyTextField
          className="flex-1"
          label="New Option"
          placeholder="New Option"
          key="new-option"
          value={newValue}
          onChange={(value) => setValue(value)}
        />
        <Button
          variant="secondary"
          size="icon"
          onPress={() => {
            const newOptions = [...(field.config.options || []), newValue];
            updateConfig("options", newOptions);
            setValue("");
          }}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const fieldConfigurator = {
  number: <NumberConfigurator />,
  select: <SelectConfigurator />,
  text: <TextConfigurator />,
  boolean: <div></div>,
};
const ConfigurationForm = () => {
  const field = useBuilderStore((state) => state.field);
  const updateRoot = useBuilderStore((state) => state.updateRoot);
  const setType = useBuilderStore((state) => state.setType);
  let validation = <div></div>;
  const maybeValidator = fieldConfigurator[field.type];
  if (maybeValidator) {
    validation = maybeValidator;
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <JollyTextField
          className="col-span-2"
          label="Label"
          placeholder="Label"
          key="label"
          value={field.label}
          onChange={(value) => updateRoot("label", value)}
        />
        <JollyTextField
          className="col-span-2"
          label="Name"
          placeholder="Name"
          key="name"
          value={field.name}
          onChange={(value) => updateRoot("name", value)}
        />
        <JollyTextField
          className="col-span-4"
          label="Placeholder"
          placeholder="Placeholder"
          key="placeholder"
          value={field.config.placeholder}
          onChange={(value) => updateRoot("config", { ...field.config, placeholder: value })}
        />
        <JollySelect
          className="col-span-4"
          label="Field Type"
          placeholder="Pick a value"
          onChange={(value: FieldType) => setType(value || "text")}
        >
          <SelectItem id="number">number</SelectItem>
          <SelectItem id="select">select</SelectItem>
          <SelectItem id="text">text</SelectItem>
          <SelectItem id="boolean">boolean</SelectItem>
        </JollySelect>
      </div>
      {validation}
    </>
  );
};

export default ConfigurationForm;
