import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"

const usePageNumber = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = searchParams.get("p") || "1"
  const pageNumber = parseInt(pageParam)
  if (pageNumber < 1 || isNaN(pageNumber)) setSearchParams({ p: "1" })
  const setPageNumber = useCallback(
    (p: number) => {
      setSearchParams({ p: p.toString() })
    },
    [setSearchParams],
  )

  return { pageNumber, setPageNumber }
}

export default usePageNumber
