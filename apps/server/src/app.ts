import { toNodeHandler } from "better-auth/node"
import cors from "cors"
import express from "express"
import helmet from "helmet"

import { apiReference } from "@scalar/express-api-reference"
import * as trpcExpress from "@trpc/server/adapters/express"
import morgan from "morgan"
import { createOpenApiExpressMiddleware } from "trpc-to-openapi"
import { env } from "./env.js"
import { auth } from "./lib/auth.js"
import { openApiDocument } from "./lib/open-api-document.js"
import { errorHandler, notFound } from "./middleware/error-handler.js"
import { createContext } from "./trpc/context.js"
import { appRouter } from "./trpc/routers/_app.js"

const app = express()
app.use(morgan("dev"))
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        "connect-src": ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  }),
)
app.use(
  cors({
    origin: env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
)
app.all("/api/auth/{*any}", toNodeHandler(auth))

app.use(express.json())

app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)

app.use(
  "/reference",
  apiReference({
    content: openApiDocument,
  }),
)

app.use(notFound)
app.use(errorHandler)

export default app
