import { toastManager } from "@/lib/toast-manager"

interface ToastOptions {
  title?: string
  description?: string
  timeout?: number
  type?: string
}

export function toast({ title, description, timeout = 5000, type }: ToastOptions) {
  return toastManager.add({
    title,
    description,
    timeout,
    type,
  })
}
