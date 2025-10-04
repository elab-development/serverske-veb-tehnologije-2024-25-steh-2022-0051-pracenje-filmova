import Logo from "@/components/logo"
import { Link } from "react-router-dom"

const authors = ["Šipka", "Miša", "Nemanja"]

const Footer = () => {
  return (
    <footer>
      <div className="container flex min-h-20 flex-col items-center justify-between border-t py-4 sm:flex-row">
        <div>
          <Link
            to={"/"}
            className="group inline-flex items-center gap-2 text-primary transition-colors hover:text-foreground"
            tabIndex={0}
          >
            <span className="text-3xl">
              <Logo className="transition-colors group-hover:text-foreground" />
            </span>
            <span className="text-sm font-bold">Movie app</span>
          </Link>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">
            Created by: {authors.join(", ")}
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
