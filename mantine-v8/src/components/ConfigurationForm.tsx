import { Button, Grid, NumberInput, Select, TextInput } from "@mantine/core";
import type { FieldType } from "../types/schema";
import { useBuilderStore } from "../store/useBuilderStore";
import { useState } from "react";

const TextConfigurator = () => {
  const field = useBuilderStore((state) => state.field);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  return (
    <Grid>
      <Grid.Col span={12}>
        <TextInput
          label="Pattern"
          placeholder="Regex pattern"
          key="pattern"
          value={field.validation.pattern}
          onChange={(event) => updateValidation("pattern", event.currentTarget.value)}
        />
      </Grid.Col>
    </Grid>
  );
};

const NumberConfigurator = () => {
  const field = useBuilderStore((state) => state.field);
  const updateValidation = useBuilderStore((state) => state.updateValidation);
  const updateConfig = useBuilderStore((state) => state.updateConfig);
  return (
    <Grid>
      <Grid.Col span={6}>
        <NumberInput
          label="Min"
          placeholder="Set min"
          key="min"
          value={field.validation.min}
          onChange={(event) => updateValidation("min", event.valueOf())}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <NumberInput
          label="Max"
          placeholder="Set max"
          key="max"
          value={field.validation.max}
          onChange={(event) => updateValidation("max", event.valueOf())}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <NumberInput
          label="Decimal Places"
          placeholder={"2"}
          key="decimal-places"
          value={field.config.decimalPlaces || 2}
          onChange={(event) => updateConfig("decimalPlaces", event.valueOf())}
        />
      </Grid.Col>
    </Grid>
  );
};

const SelectConfigurator = () => {
  const [newValue, setValue] = useState("");
  const field = useBuilderStore((state) => state.field);
  const updateConfig = useBuilderStore((state) => state.updateConfig);

  return (
    <Grid>
      {field.config.options?.map((option, index) => (
        <Grid.Col span={12} key={index}>
          <TextInput
            label={`Option ${index + 1}`}
            placeholder={`Option ${index + 1}`}
            key={`option-${index}`}
            value={option}
            onChange={(event) => {
              const newOptions = [...(field.config.options || [])];
              newOptions[index] = event.currentTarget.value;
              updateConfig("options", newOptions);
            }}
          />
        </Grid.Col>
      ))}
      <Grid.Col span={12}>
        <TextInput
          label="New Option"
          placeholder="New Option"
          key="new-option"
          value={newValue}
          onChange={(event) => setValue(event.currentTarget.value)}
          rightSection={
            <Button
              size="compact-sm"
              onClick={() => {
                const newOptions = [...(field.config.options || []), newValue];
                updateConfig("options", newOptions);
                setValue("");
              }}
            >
              +
            </Button>
          }
        />
      </Grid.Col>
    </Grid>
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
  console.log(field.type);
  return (
    <>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Label"
            placeholder="Label"
            size="sm"
            key="label"
            value={field.label}
            onChange={(event) => updateRoot("label", event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Name"
            placeholder="Name"
            key="name"
            size="sm"
            value={field.name}
            onChange={(event) => updateRoot("name", event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Placeholder"
            placeholder="Placeholder"
            key="placeholder"
            size="sm"
            value={field.config.placeholder}
            onChange={(event) =>
              updateRoot("config", { ...field.config, placeholder: event.currentTarget.value })
            }
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            label="Field Type"
            placeholder="Pick a value"
            data={["number", "select", "text", "boolean"]}
            onChange={(value: FieldType) => setType(value || "text")}
          />
        </Grid.Col>
      </Grid>
      {validation}
    </>
  );
};

export default ConfigurationForm;
