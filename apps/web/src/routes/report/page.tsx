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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useProtectedPage } from "@/hooks/use-protected-page"
import { ToastOptions } from "@/lib/models/toast-options"
import { trpc } from "@/lib/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { BugFlagEnum } from "backend"
import { useForm } from "react-hook-form"
import z from "zod"

const bugFlagEnum: BugFlagEnum[] = [
  "UI",
  "Performance",
  "Backend",
  "Security",
  "Other",
]

const reportSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  flag: z.string().refine((val) => bugFlagEnum.includes(val as BugFlagEnum), {
    message: "Invalid flag",
  }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" })
    .max(1000, { message: "Content must be at most 1000 characters" }),
})

const ReportPage = () => {
  useProtectedPage()
  const { toast } = useToast()

  const reportMutation = useMutation(
    trpc.reports.submitReport.mutationOptions(),
  )

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      flag: "Other",
      content: "",
    },
  })
  async function onSubmit(values: z.infer<typeof reportSchema>) {
    try {
      await reportMutation.mutateAsync(values)
    } catch (error) {
      toast(
        ToastOptions.createDestructive()
          .setTitle("Error")
          .setDescription("Failed to send report. Please try again."),
      )
      return
    }
    toast(
      ToastOptions.createDefault()
        .setTitle("Report sent!")
        .setDescription("Thank you for your feedback."),
    )
    form.reset()
  }
  return (
    <section>
      <SectionTitle>Report a bug</SectionTitle>
      <Separator className="mb-12 mt-2" />
      <div className="grid place-items-center">
        <div className="w-full max-w-sm space-y-8">
          <h2 className="relative text-lg font-bold lg:text-xl">
            Found a bug? Let us know!
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flag</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a flag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bugFlagEnum.map((flag) => (
                          <SelectItem key={flag} value={flag}>
                            {flag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe the bug</FormLabel>
                    <FormControl>
                      <Textarea className="h-64 resize-none" {...field} />
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
                Send report
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}

export default ReportPage
