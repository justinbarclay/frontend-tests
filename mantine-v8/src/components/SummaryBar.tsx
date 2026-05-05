import { Box, Group, Stack, Text } from "@mantine/core";
import { useFieldStore } from "../store/useFieldStore";
import classes from "./SummaryBar.module.css";

export const SummaryBar = () => {
  const fields = useFieldStore((state) => state.fields);
  const activeFieldsCount = fields.filter((f) => f.status === "active").length;

  return (
    <Box className={classes.root}>
      <Group gap="xl">
        <Stack gap={4}>
          <Text className={classes.statLabel}>Total Fields</Text>
          <Text className={classes.statValue}>{fields.length}</Text>
        </Stack>

        <Box className={classes.divider} />

        <Stack gap={4}>
          <Text className={classes.statLabel}>Active Fields</Text>
          <Text className={classes.statValue}>{activeFieldsCount}</Text>
        </Stack>
      </Group>
    </Box>
  );
};

export default SummaryBar;
