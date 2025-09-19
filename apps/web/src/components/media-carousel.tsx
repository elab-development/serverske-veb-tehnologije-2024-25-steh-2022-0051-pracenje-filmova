import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const MediaCarousel: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4 md:pb-8">
      <div className="flex w-max justify-center gap-6 gap-y-8">{children}</div>
      <ScrollBar orientation="horizontal" className="md:h-4" />
    </ScrollArea>
  )
}

export default MediaCarousel
