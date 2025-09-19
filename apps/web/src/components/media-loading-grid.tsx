import { Separator } from "@/components/ui/separator"
import MediaItemLoader from "./media-item-loader"
import SectionTitle from "./ui/section-title"

const LoadingMediaGrid = ({
  length = 5,
  title = "",
}: {
  length: number
  title: string
}) => {
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <Separator className="mb-12 mt-2" />
      <div className="flex flex-wrap justify-center gap-6 gap-y-8">
        {Array.from({ length }).map((_, i) => (
          // placeholder for MediaItem
          <MediaItemLoader key={i} />
        ))}
      </div>
    </>
  )
}

export default LoadingMediaGrid
