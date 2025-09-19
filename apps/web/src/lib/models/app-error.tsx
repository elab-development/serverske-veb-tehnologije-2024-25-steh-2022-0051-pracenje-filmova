import { ErrorResponse } from "tmdb-ts"

export class AppError implements ErrorResponse {
  readonly status_code: number
  readonly status_message: string
  readonly success: boolean

  constructor(error: unknown) {
    let status_code = 500
    let status_message = "Unknown error"
    let success = false

    if (error === null || error === undefined) {
      status_message = "Undefined error"
    } else if (error instanceof Error) {
      status_message = error.message
    } else if (typeof error === "string") {
      status_message = error
    } else if (typeof error === "object") {
      if ("status_code" in error && typeof error.status_code === "number") {
        status_code = error.status_code
      }
      if (
        "status_message" in error &&
        typeof error.status_message === "string"
      ) {
        status_message = error.status_message
      }
      if ("success" in error && typeof error.success === "boolean") {
        success = error.success
      }
    } else if (typeof error === "number") {
      status_code = error
    }

    this.status_code = status_code
    this.status_message = status_message
    this.success = success
  }
}
