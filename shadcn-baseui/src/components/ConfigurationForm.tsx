import type { ComponentType } from "react";
import { useState } from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import type { FieldType } from "@/types/schema";
import { Input } from "./ui/input";
import { Field, FieldLabel } from "./ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { Checkbox } from "./ui/checkbox";

const TextConfigurator = () => {
  const field = useBuilderStore((state) => state.field);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <Field className="col-span-12">
        <FieldLabel>Pattern</FieldLabel>
        <Input
          placeholder="Regex pattern"
          value={field.validation.pattern ?? ""}
          onChange={(event) => updateValidation("pattern", event.currentTarget.value)}
        />
      </Field>
    </div>
  );
};

const NumberConfigurator = () => {
  const field = useBuilderStore((state) => state.field);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  const updateConfig = useBuilderStore((state) => state.updateConfig);
  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <Field className="col-span-6">
        <FieldLabel>Min</FieldLabel>
        <Input
          placeholder="Set min"
          value={field.validation.min ?? ""}
          onChange={(event) => updateValidation("min", event.currentTarget.value)}
        />
      </Field>
      <Field className="col-span-6">
        <FieldLabel>Max</FieldLabel>
        <Input
          placeholder="Set max"
          value={field.validation.max ?? ""}
          onChange={(event) => updateValidation("max", event.currentTarget.value)}
        />
      </Field>
      <Field className="col-span-12">
        <FieldLabel>Decimal Places</FieldLabel>
        <Input
          type="number"
          placeholder="2"
          value={field.config.decimalPlaces ?? ""}
          onChange={(event) => updateConfig("decimalPlaces", event.currentTarget.value)}
        />
      </Field>
    </div>
  );
};

const SelectConfigurator = () => {
  const [newValue, setValue] = useState("");
  const field = useBuilderStore((state) => state.field);
  const updateConfig = useBuilderStore((state) => state.updateConfig);

  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <Field className="col-span-12">
        <FieldLabel>Options</FieldLabel>
        {field.config.options?.map((option, index) => (
          <InputGroup key={`option-${index}`}>
            <InputGroupInput
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(event) => {
                const newOptions = [...(field.config.options || [])];
                newOptions[index] = event.currentTarget.value;
                updateConfig("options", newOptions);
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label={`Remove option ${index + 1}`}
                onClick={() => {
                  const newOptions = (field.config.options || []).filter((_, i) => i !== index);
                  updateConfig("options", newOptions);
                }}
              >
                ×
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ))}
      </Field>
      <Field className="col-span-12">
        <FieldLabel>New Option</FieldLabel>
        <InputGroup>
          <InputGroupInput
            placeholder="New Option"
            value={newValue}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Add option"
              onClick={() => {
                if (!newValue.trim()) return;
                updateConfig("options", [...(field.config.options || []), newValue]);
                setValue("");
              }}
            >
              +
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
};

const fieldConfigurators: Partial<Record<FieldType, ComponentType>> = {
  number: NumberConfigurator,
  select: SelectConfigurator,
  text: TextConfigurator,
};

const ConfigurationForm = () => {
  const field = useBuilderStore((state) => state.field);
  const updateRoot = useBuilderStore((state) => state.updateRoot);
  const updateConfig = useBuilderStore((state) => state.updateConfig);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  const setType = useBuilderStore((state) => state.setType);
  const TypeConfigurator = fieldConfigurators[field.type];

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <Field className="col-span-6">
          <FieldLabel>Label</FieldLabel>
          <Input
            placeholder="Label"
            value={field.label}
            onChange={(event) => updateRoot("label", event.currentTarget.value)}
          />
        </Field>
        <Field className="col-span-6">
          <FieldLabel>Name</FieldLabel>
          <Input
            placeholder="Name"
            value={field.name}
            onChange={(event) => updateRoot("name", event.currentTarget.value)}
          />
        </Field>
        <Field className="col-span-6">
          <FieldLabel>Field Type</FieldLabel>
          <Select
            value={field.type}
            onValueChange={(value) => {
              if (value) setType(value as FieldType);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">text</SelectItem>
              <SelectItem value="number">number</SelectItem>
              <SelectItem value="boolean">boolean</SelectItem>
              <SelectItem value="select">select</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field className="col-span-6">
          <FieldLabel>Status</FieldLabel>
          <Select
            value={field.status}
            onValueChange={(value) => {
              if (value) updateRoot("status", value as "active" | "inactive");
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">active</SelectItem>
              <SelectItem value="inactive">inactive</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field className="col-span-12">
          <FieldLabel>Placeholder</FieldLabel>
          <Input
            placeholder="Placeholder"
            value={field.config.placeholder ?? ""}
            onChange={(event) => updateConfig("placeholder", event.currentTarget.value)}
          />
        </Field>
        <Field className="col-span-12">
          <FieldLabel>Default Value</FieldLabel>
          <Input
            placeholder="Default value"
            value={(field.config.defaultValue as string) ?? ""}
            onChange={(event) => updateConfig("defaultValue", event.currentTarget.value)}
          />
        </Field>
        <Field className="col-span-12" orientation="horizontal">
          <Checkbox
            id="field-required"
            checked={field.validation.required}
            onCheckedChange={(checked) => updateValidation("required", checked)}
          />
          <FieldLabel htmlFor="field-required">Required</FieldLabel>
        </Field>
      </div>
      {TypeConfigurator && <TypeConfigurator />}
    </>
  );
};

export default ConfigurationForm;
