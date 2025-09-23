import { authClient } from "@/lib/auth-client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useProtectedPage = (role?: string) => {
  const { data: session, isPending, error } = authClient.useSession()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate("/auth/login")
    }
    if (!isPending && session?.user && role && session.user.role !== role) {
      throw new Error("Unauthorized")
    }
  }, [session, isPending, navigate])
  return { session, isPending, error }
}
