import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import {
  HeartIcon,
  LogInIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const ProfileDropdown = () => {
  const { data, error, isPending } = authClient.useSession()
  const navigate = useNavigate()
  if (isPending) {
    return (
      <Button
        variant="secondary"
        size={"icon"}
        className="pointer-events-none animate-pulse"
      ></Button>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size={"icon"}>
          <UserIcon height={"1.25em"} />
          <span className="sr-only">Open profile menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {data?.user?.name ?? data?.user?.email ?? "Profile"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={"/watchlist"}>
            <HeartIcon /> Watchlist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon /> Profile settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {data?.user ? (
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut()
              navigate("/")
            }}
          >
            <LogOutIcon /> Sign out
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90"
            asChild
          >
            <Link to={"/auth/login"}>
              <LogInIcon /> Log in
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
