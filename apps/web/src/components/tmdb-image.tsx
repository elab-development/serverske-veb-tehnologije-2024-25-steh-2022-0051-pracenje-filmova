import { cn } from "@/lib/utils"
import React from "react"

const imageBaseUrl = "https://image.tmdb.org/t/p"
const backdropSizes = ["w300", "w780", "w1280"]
const logoSizes = ["w45", "w92", "w154", "w185", "w300", "w500"]
const posterSizes = ["w92", "w154", "w185", "w342", "w500", "w780"]

const tmdbSizes = {
  backdrop: backdropSizes,
  logo: logoSizes,
  poster: posterSizes,
}

const generateSrcSetFromtmdbSize = (
  tmdbSize: "backdrop" | "logo" | "poster",
  path: string,
) => {
  if (path === null || path === undefined) return ""
  return tmdbSizes[tmdbSize]
    .map((size) => `${imageBaseUrl}/${size}${path} ${size.split("w")[1]}w`)
    .join(", ")
}

interface TMDBImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  tmdbSize: "backdrop" | "logo" | "poster"
  src: string
}

const TMDBImage = ({
  decoding = "async",
  className,
  tmdbSize,
  src,
  alt = "",
  ...props
}: TMDBImageProps) => {
  return (
    <img
      alt={alt}
      {...props}
      decoding={decoding}
      className={cn("bg-muted", className)}
      srcSet={generateSrcSetFromtmdbSize(tmdbSize, src)}
    />
  )
}

export default TMDBImage
