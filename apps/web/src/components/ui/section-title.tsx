import { cn } from "@/lib/utils"

const SectionTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1
      className={cn("relative text-xl font-bold lg:text-2xl", className)}
      {...props}
    ></h1>
  )
}

export default SectionTitle
