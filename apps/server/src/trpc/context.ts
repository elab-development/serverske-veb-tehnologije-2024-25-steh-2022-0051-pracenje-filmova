import * as trpcExpress from "@trpc/server/adapters/express"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../lib/auth"

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const authData = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  if (!authData || !authData.user) {
    return { user: null }
  }

  return {
    user: authData.user,
  }
} // no context
export type Context = Awaited<ReturnType<typeof createContext>>
