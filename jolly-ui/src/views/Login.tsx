import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JollyTextField as TextField } from "@/components/ui/textfield";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function Login() {
  const login = useAuthStore((state) => state.login);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === "admin@example.com" && password === "password") {
      toast("Welcome back!", "success");
      login();
    } else {
      toast("Invalid credentials", "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-sm space-y-8 rounded-2xl border bg-card p-8 shadow-xl">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black tracking-tighter">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Enter admin credentials to manage your schema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={setEmail}
          errorMessage={errors.email}
          onBlur={validate}
        />

        <div className="relative">
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            errorMessage={errors.password}
            onBlur={validate}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-8 size-8 text-muted-foreground"
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>

        <Button type="submit" className="w-full font-bold" isDisabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login to Architect"
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Hint: admin@example.com / password
      </div>
    </div>
  );
}
