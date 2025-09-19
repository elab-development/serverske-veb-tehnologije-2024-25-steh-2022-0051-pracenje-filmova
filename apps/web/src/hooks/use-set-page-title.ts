import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export const useSetPageTitle = (title: string | undefined) => {
  const location = useLocation()

  useEffect(() => {
    title != undefined && (document.title = title + " | Movie App")
  }, [location, title])
}
