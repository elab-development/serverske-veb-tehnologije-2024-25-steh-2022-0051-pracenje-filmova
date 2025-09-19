import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { HeartIcon } from "lucide-react"
import { Link, Form as ReactRouterForm } from "react-router-dom"
import { MobileSidebar } from "../sidebar"
import SearchBar from "./search-bar"

const Navbar = () => {
  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="container flex h-14 items-center gap-4 md:justify-between">
        <Link to={"/"} className="group text-3xl">
          <Logo className="transition-colors group-hover:text-foreground" />
          <span className="sr-only">Home</span>
        </Link>

        <ReactRouterForm
          method="get"
          action="/search"
          className="max-sm:flex-1"
        >
          <SearchBar />
        </ReactRouterForm>
        <div className="flex items-center gap-2 sm:flex-1 sm:justify-end md:flex-none">
          <Button asChild variant={"secondary"} size={"icon"}>
            <Link to="/watchlist">
              <HeartIcon height={"1.125em"} />
              <span className="sr-only">View watchlist</span>
            </Link>
          </Button>

          <MobileSidebar />
        </div>
      </div>
    </header>
  )
}

export default Navbar
