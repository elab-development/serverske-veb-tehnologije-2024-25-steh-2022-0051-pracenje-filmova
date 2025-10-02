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
import { ToastOptions } from "@/lib/models/toast-options"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import * as z from "zod/v4"

const forgotPasswordSchema = z.object({
  email: z.email(),
})

function ForgotPasswordPage() {
  useSetPageTitle("Forgot password")
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })
  const navigate = useNavigate()
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    await authClient.requestPasswordReset(
      {
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
      {
        onSuccess: () => {
          navigate("/")
          toast(
            ToastOptions.create()
              .setTitle("Reset email sent")
              .setDescription("Check your inbox for further instructions."),
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
      <SectionTitle>Forgot password</SectionTitle>
      <Separator className="mb-12 mt-2" />
      <div className="grid place-items-center">
        <div className="w-full max-w-sm space-y-8">
          <h2 className="relative text-lg font-bold lg:text-xl">
            Forgot your password?
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn@gmail.com" {...field} />
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

export default ForgotPasswordPage
