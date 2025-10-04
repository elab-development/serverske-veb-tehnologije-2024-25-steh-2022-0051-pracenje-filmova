"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import SectionTitle from "@/components/ui/section-title"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useSetPageTitle } from "@/hooks/use-set-page-title"
import { authClient } from "@/lib/auth-client"
import { AppError } from "@/lib/models/app-error"
import { ToastOptions } from "@/lib/models/toast-options"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import * as z from "zod/v4"

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })

function ResetPasswordPage() {
  useSetPageTitle("Reset password")

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  })
  const navigate = useNavigate()
  const { toast } = useToast()

  const token = useMemo(() => {
    return new URLSearchParams(window.location.search).get("token")
  }, [])

  if (!token) {
    throw new AppError("Invalid or missing token")
  }

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) {
      throw new AppError("Invalid or missing token")
    }
    await authClient.resetPassword(
      {
        newPassword: values.newPassword,
        token,
      },
      {
        onSuccess: () => {
          navigate("/")
          toast(
            ToastOptions.create()
              .setTitle("Password successfully reset")
              .setDescription("You can now log in with your new password."),
          )
        },
        onError: (err) => {
          toast(
            ToastOptions.createDestructive()
              .setTitle("Error signing up in")
              .setDescription(
                err.error.message ?? "An unknown error occurred.",
              ),
          )
        },
      },
    )
  }

  return (
    <section>
      <SectionTitle>Reset password</SectionTitle>
      <Separator className="mb-12 mt-2" />
      <div className="grid place-items-center">
        <div className="w-full max-w-sm space-y-8">
          <h2 className="relative text-lg font-bold lg:text-xl">
            Reset your password
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                Reset password
              </Button>
            </form>
          </Form>
          <Button
            asChild
            type="button"
            variant={"link"}
            className="!mt-4 w-full"
            disabled={form.formState.isSubmitting}
          >
            <Link to="/auth/signup">New to Movie app? Sign up!</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ResetPasswordPage
