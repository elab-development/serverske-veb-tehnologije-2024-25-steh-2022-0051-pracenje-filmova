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

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

function LoginPage() {
  useSetPageTitle("Login")

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { toast } = useToast()
  const navigation = useNavigate()

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          navigation("/")
          toast(
            ToastOptions.create()
              .setTitle("Success")
              .setDescription("You have successfully logged in!"),
          )
        },
        onError: (err) => {
          toast(
            ToastOptions.createDestructive()
              .setTitle("Error logging in")
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
      <SectionTitle>Login</SectionTitle>
      <Separator className="mb-12 mt-2" />
      <div className="grid place-items-center">
        <div className="w-full max-w-sm space-y-8">
          <h2 className="relative text-lg font-bold lg:text-xl">
            Welcome back!
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                Login
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
            <Link to="/auth/signup">Don't have an account? Sign up</Link>
          </Button>
          <Button
            asChild
            type="button"
            variant={"link"}
            className="!mt-0 w-full"
            disabled={form.formState.isSubmitting}
          >
            <Link to="/auth/forgot-password">Forgot password?</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
