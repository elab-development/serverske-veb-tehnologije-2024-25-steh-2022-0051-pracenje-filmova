import type { AuthServer } from "@/types/server"
import {
  customSessionClient,
  inferAdditionalFields,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  plugins: [
    customSessionClient<AuthServer>(),
    inferAdditionalFields<AuthServer>(),
  ],
})
