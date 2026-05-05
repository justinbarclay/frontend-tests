import { Drawer, Button, Group, Text, Box, Stack, Divider, ScrollArea, Paper } from "@mantine/core";
import { useBuilderStore } from "../store/useBuilderStore";
import { useFieldStore } from "../store/useFieldStore";
import Preview from "./PreviewField";
import ConfigurationForm from "./ConfigurationForm";
import { notifications } from "@mantine/notifications";

interface BuilderDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export const BuilderDrawer = ({ opened, onClose }: BuilderDrawerProps) => {
  const { field, reset } = useBuilderStore();
  const addField = useFieldStore((state) => state.addField);

  const onCancel = () => {
    reset();
    onClose();
  };

  const onSave = () => {
    if (!field.label || !field.name) {
      notifications.show({
        title: "Validation Error",
        message: "Label and Name are required",
        color: "red",
      });
      return;
    }

    addField(field);
    notifications.show({
      title: "Field Created",
      message: `${field.label} has been added to the ledger`,
      color: "green",
    });
    onCancel();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onCancel}
      title={
        <Text fw={700} size="lg">
          New Field
        </Text>
      }
      position="right"
      size="xl"
      padding="0"
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
      <Group gap={0} h="calc(100vh - 60px)" align="stretch">
        <Box
          flex={1}
          p="md"
          style={{ borderRight: "1px solid var(--mantine-color-default-border)" }}
          component={ScrollArea}
        >
          <Text fw={600} mb="md">
            Editor
          </Text>
          <Stack>
            <ConfigurationForm />
          </Stack>
        </Box>

        <Box flex={1} p="md" bg="var(--mantine-color-gray-0)" component={ScrollArea}>
          <Text fw={600} mb="md">
            Preview
          </Text>
          <Paper withBorder p="xl" radius="md" shadow="sm">
            <Preview />
          </Paper>
        </Box>
      </Group>

      <Divider />

      <Box p="md">
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Field</Button>
        </Group>
      </Box>
    </Drawer>
  );
};
