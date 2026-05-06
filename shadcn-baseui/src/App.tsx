"use client"

import { useAuthStore } from "@/store/useAuthStore"
import { Toaster } from "@/components/ui/toaster"
import { LoginForm } from "@/components/login-form"
import { AdminLayout } from "@/components/admin-layout"
import { FieldLedger } from "@/components/field-ledger"
import { ActionBar } from "@/components/action-bar"
import { FieldBuilder } from "@/components/field-builder"

export function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex min-h-svh items-center justify-center p-6 bg-muted/40">
          <div className="w-full max-w-sm space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access the Schema Architect
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
        <Toaster />
      </>
    )
  }

  return (
    <>
      <AdminLayout>
        <div className="container mx-auto p-6">
          <FieldLedger />
        </div>
        <ActionBar />
        <FieldBuilder />
      </AdminLayout>
      <Toaster />
    </>
  )
}

export default App
