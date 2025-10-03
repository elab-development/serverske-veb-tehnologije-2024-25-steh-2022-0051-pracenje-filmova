import { generateOpenApiDocument } from "trpc-to-openapi"
import { env } from "../env"
import { appRouter } from "../trpc/routers/_app"

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Movie app API",
  version: "1.0.0",
  baseUrl: `${env.SERVER_URL}/api`,
  securitySchemes: {
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "better-auth.session-token",
      description: "Authentication via cookie",
    },
  },
})
