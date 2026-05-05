import React from "react";
import {
  AppShell,
  Burger,
  Group,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Text,
  Button,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Sun, Moon, LogOut, Database, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
  const logout = useAuthStore((state) => state.logout);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Database size={24} />
            <Text fw={700} size="lg">
              Schema Architect
            </Text>
          </Group>

          <Group>
            <ActionIcon
              onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </ActionIcon>
            <Button
              variant="subtle"
              color="red"
              leftSection={<LogOut size={16} />}
              onClick={logout}
            >
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size="xs" fw={700} c="dimmed" mb="xs" tt="uppercase">
          Main Menu
        </Text>
        <NavLink label="Field Ledger" leftSection={<Database size={16} />} active variant="light" />
        <NavLink label="Dashboard" leftSection={<LayoutDashboard size={16} />} disabled />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
