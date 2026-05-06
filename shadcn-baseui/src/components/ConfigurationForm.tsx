import { useBuilderStore } from "@/store/useBuilderStore";
import type { FieldType } from "@/types/schema";
import { useState } from "react";
import { Input } from "./ui/input";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";

const TextConfigurator = () => {
  const field = useBuilderStore((state) => state.field);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  return (
    <FieldGroup className="grid grid-cols-12">
      <Field className="col-span-12">
        <FieldLabel>Pattern</FieldLabel>
        <Input placeholder="Regex pattern" key="pattern" value={field.validation.pattern} onChange={(event) => updateValidation("pattern", event.currentTarget.value)} />
      </Field>
    </FieldGroup>
  );
};

const NumberConfigurator = () => {
  const field = useBuilderStore((state) => state.field);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  const updateConfig = useBuilderStore((state) => state.updateConfig);
  return (
    <FieldGroup className="grid grid-cols-12">
      <Field className="col-span-6">
        <FieldLabel>Min</FieldLabel>
        <Input placeholder="Set min" key="min" value={field.validation.min} onChange={(event) => updateValidation("min", event.currentTarget.value)} />
      </Field>
      <Field className="col-span-6">
        <FieldLabel>Max</FieldLabel>
        <Input placeholder="Set max" key="max" value={field.validation.max} onChange={(event) => updateValidation("max", event.currentTarget.value)} />
      </Field>
      <Field className="col-span-12">
        <FieldLabel>Decimal Places</FieldLabel>
        <Input
          type="number"
          placeholder={"2"}
          key="decimal-places"
          value={field.config.decimalPlaces || 2}
          onChange={(event) => updateConfig("decimalPlaces", event.currentTarget.value)}
        />
        </Field>
    </FieldGroup>
  );
};

const SelectConfigurator = () => {
  const [newValue, setValue] = useState("");
  const field = useBuilderStore((state) => state.field);
  const updateConfig = useBuilderStore((state) => state.updateConfig);

  return (
    <FieldGroup className="grid grid-cols-12">
      <Field className="col-span-12">
        <FieldLabel>Options</FieldLabel>
        {field.config.options?.map((option, index) => (
          <Input
            placeholder={`Option ${index + 1}`}
            key={`option-${index}`}
            value={option}
            onChange={(event) => {
              const newOptions = [...(field.config.options || [])];
              newOptions[index] = event.currentTarget.value;
              updateConfig("options", newOptions);
            }}
          />
        ))}
      </Field>
      <Field className="col-span-12">
        <FieldLabel>New Option</FieldLabel>
        <InputGroup>
          <InputGroupInput
            placeholder="New Option"
            key="new-option"
            value={newValue}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Add option" onClick={() => {
              const newOptions = [...(field.config.options || []), newValue];
              updateConfig("options", newOptions);
              setValue("");
            }
            }>
              +
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
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
      <FieldGroup className="grid grid-cols-12">
        <Field className="col-span-6">
          <FieldLabel>Label</FieldLabel>
          <Input placeholder="Label" key="label" value={field.label} onChange={(event) => updateRoot("label", event.currentTarget.value)} />
        </Field>
        <Field className="col-span-6">
          <FieldLabel>Name</FieldLabel>
          <Input placeholder="Name" key="name" value={field.name} onChange={(event) => updateRoot("name", event.currentTarget.value)} />
        </Field>
        <Field className="col-span-12">
          <FieldLabel>Placeholder</FieldLabel>
          <Input
            placeholder="Placeholder"
            key="placeholder"
            value={field.config.placeholder}
            onChange={(event) => updateRoot("config", { ...field.config, placeholder: event.currentTarget.value })}
          />
        </Field>
        <Field className="col-span-12">
          <FieldLabel>Field Type</FieldLabel>
          <Select<FieldType>
            value={field.type}
            onValueChange={ (value) => setType(value) }
          >
            <SelectTrigger>
              <SelectValue>{field.type}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">text</SelectItem>
              <SelectItem value="number">number</SelectItem>
              <SelectItem value="boolean">boolean</SelectItem>
              <SelectItem value="select">select</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
        {
          validation
        }
    </>
  );
};

export default ConfigurationForm;
