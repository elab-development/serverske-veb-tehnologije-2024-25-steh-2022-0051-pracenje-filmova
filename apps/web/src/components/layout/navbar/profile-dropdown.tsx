import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { authClient } from "@/lib/auth-client"
import { ToastOptions } from "@/lib/models/toast-options"
import {
  BugIcon,
  FlagIcon,
  HeartIcon,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const ProfileDropdown = () => {
  const { data, isPending } = authClient.useSession()
  const navigate = useNavigate()
  const { toast } = useToast()
  if (isPending) {
    return (
      <Button
        variant="secondary"
        size={"icon"}
        className="pointer-events-none animate-pulse"
      ></Button>
    )
  }

  const signOut = async () => {
    await authClient.signOut()
    navigate("/")
    toast(
      ToastOptions.createDefault()
        .setTitle("Signed out")
        .setDescription("You have been signed out successfully."),
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
        <DropdownMenuItem asChild>
          <Link to={"/reports/new"}>
            <BugIcon /> Report a bug
          </Link>
        </DropdownMenuItem>
        {data?.user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={"/reports"}>
                <FlagIcon /> All reports
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        {data?.user ? (
          <DropdownMenuItem onClick={signOut}>
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
