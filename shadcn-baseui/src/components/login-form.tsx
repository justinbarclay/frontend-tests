"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { toast } from "@/lib/toast"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export function LoginForm() {
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (email === "admin@example.com" && password === "password") {
        login(email)
        toast({
          title: "Welcome back",
          description: "You have successfully logged in.",
        })
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password.",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validate}
            aria-invalid={!!errors.email}
          />
        </InputGroup>
        <FieldError>{errors.email}</FieldError>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validate}
            aria-invalid={!!errors.password}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldError>{errors.password}</FieldError>
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Spinner className="mr-2" />}
        Login
      </Button>
    </form>
  )
}
