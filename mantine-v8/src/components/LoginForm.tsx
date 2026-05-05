import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "../store/useAuthStore";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const login = useAuthStore((state) => state.login);

  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "admin@example.com" && password === "password") {
      login("mock-token");
      notifications.show({
        title: "Welcome back",
        message: "You have successfully logged in",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Invalid credentials",
        message: "Please check your email and password",
        color: "red",
      });
    }
    setLoading(false);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        The Schema Architect
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Sign in to manage your data schema
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="admin@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            onBlur={() => validate()}
            error={errors.email}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onBlur={() => validate()}
            error={errors.password}
          />
          <Group justify="space-between" mt="lg">
            <Text size="xs" c="dimmed">
              Use admin@example.com / password
            </Text>
          </Group>
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
