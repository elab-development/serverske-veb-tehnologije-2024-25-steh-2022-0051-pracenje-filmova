import { z } from "zod/v4"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  DB_FILE_NAME: z.string().min(1).default("file:src/db/local.db"),
  ETHEREAL_USERNAME: z.string().min(1),
  ETHEREAL_PASSWORD: z.string().min(1),
})

try {
  // eslint-disable-next-line node/no-process-env
  envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      "Missing environment variables:",
      error.issues.flatMap((issue) => issue.path),
    )
  } else {
    console.error(error)
  }
  process.exit(1)
}

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env)
