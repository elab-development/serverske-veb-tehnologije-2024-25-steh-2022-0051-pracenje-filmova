import MediaCarousel from "@/components/media-carousel"
import MediaItemLoader from "@/components/media-item-loader"
import { Button } from "@/components/ui/button"
import SectionTitle from "@/components/ui/section-title"
import { Separator } from "@/components/ui/separator"

const TrendingLoader = () => {
  return (
    <div>
      <div className="mb-12 animate-pulse">
        <div className="aspect-video w-full bg-muted"></div>
        <div className="mt-1 flex gap-1">
          <Button
            size={"sm"}
            variant={"secondary"}
            className="pointer-events-none flex-1 border border-secondary text-lg lg:py-8"
          />
          <Button
            size="sm"
            variant={"secondary"}
            className="pointer-events-none flex-1 border border-secondary lg:py-8"
          ></Button>
        </div>
      </div>
      <SectionTitle className="max-w-60 bg-secondary">&nbsp;</SectionTitle>
      <Separator className="mb-12 mt-2" />
      <MediaCarousel>
        {Array.from({ length: 5 }).map((_, i) => (
          // placeholder for MediaItem
          <MediaItemLoader key={i} />
        ))}
      </MediaCarousel>
    </div>
  )
}

export default TrendingLoader
