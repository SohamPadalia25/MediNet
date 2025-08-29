"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all",
        colors[type]
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void
}

export const useToast = (): ToastContextType => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" | "info" }>>([])

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return { showToast }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" | "info" }>>([])

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type } = event.detail
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
    }

    window.addEventListener("show-toast" as any, handleToast)
    return () => window.removeEventListener("show-toast" as any, handleToast)
  }, [])

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}

// Global toast function
export const toast = {
  success: (message: string) => {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: { message, type: "success" } }))
  },
  error: (message: string) => {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: { message, type: "error" } }))
  },
  info: (message: string) => {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: { message, type: "info" } }))
  },
}
