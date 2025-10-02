import app from "./app.js"
import { env } from "./env.js"

// Re-export types for workspace consumers
export type { BugFlagEnum, BugStatusEnum } from "./db/schema/report-schema.js"
export type { AuthServer } from "./lib/auth"
export type { AppRouter } from "./trpc/routers/_app.js"

const port = env.PORT
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

server.on("error", (err) => {
  if ("code" in err && err.code === "EADDRINUSE") {
    console.error(
      `Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`,
    )
  } else {
    console.error("Failed to start server:", err)
  }
  process.exit(1)
})
