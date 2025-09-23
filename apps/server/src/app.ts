import { toNodeHandler } from "better-auth/node"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"

import type MessageResponse from "./interfaces/message-response.js"

import * as trpcExpress from "@trpc/server/adapters/express"
import { auth } from "./lib/auth.js"
import { createContext } from "./lib/trpc/context.js"
import { appRouter } from "./lib/trpc/routers/_app.js"
import * as middlewares from "./middlewares.js"

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

app.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  })
})

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
