import { SearchIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

const SearchBar = () => {
  const [search, setSearch] = useState("")
  return (
    <div className="relative">
      <Input
        autoComplete="off"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search movies/shows"
        placeholder="Search..."
        name="s"
        required
        className="md:w-96"
      />
      <Button
        disabled={!search}
        type="submit"
        variant={"ghost"}
        aria-label="Search"
        size={"icon"}
        className="absolute right-0 top-0 h-full"
      >
        <SearchIcon height={"1em"} />
      </Button>
    </div>
  )
}

export default SearchBar
