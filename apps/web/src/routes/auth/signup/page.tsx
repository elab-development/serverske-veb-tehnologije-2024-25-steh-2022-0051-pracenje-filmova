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
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2).max(80),
})

function SignUpPage() {
  useSetPageTitle("Sign up")
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  })
  const navigate = useNavigate()
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.fullName,
      },
      {
        onSuccess: () => {
          navigate("/")
          toast(
            ToastOptions.create()
              .setTitle("Success")
              .setDescription("You have successfully signed up!"),
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
      <SectionTitle>Sign up</SectionTitle>
      <Separator className="mb-12 mt-2" />
      <div className="grid place-items-center">
        <div className="w-full max-w-sm space-y-8">
          <h2 className="relative text-lg font-bold lg:text-xl">
            Join Movie app today!
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Pera Peric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                Sign up
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
            <Link to="/auth/login">Already a member? Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default SignUpPage
