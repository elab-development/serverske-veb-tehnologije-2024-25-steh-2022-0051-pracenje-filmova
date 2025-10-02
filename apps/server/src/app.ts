import { toNodeHandler } from "better-auth/node"
import cors from "cors"
import express from "express"
import helmet from "helmet"

import * as trpcExpress from "@trpc/server/adapters/express"
import morgan from "morgan"
import { auth } from "./lib/auth.js"
import { errorHandler, notFound } from "./middleware/error-handler.js"
import { createContext } from "./trpc/context.js"
import { appRouter } from "./trpc/routers/_app.js"

const app = express()
app.use(morgan("dev"))
app.use(helmet())
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
)
app.all("/api/auth/{*any}", toNodeHandler(auth))

app.use(express.json())

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  }),
)

app.use(notFound)
app.use(errorHandler)

export default app
