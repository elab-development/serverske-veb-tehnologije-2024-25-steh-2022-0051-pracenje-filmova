import ravenueFormatter from "@/lib/ravenue-formatter"
import runtimeFormatter from "@/lib/runtime-formatter"
import { expect, test } from "vitest"

test("1600 formatted to 1.6K", () => {
  expect(ravenueFormatter(1600, 1)).toBe("1.6k")
})

test("1600000 formatted to 1.6M", () => {
  expect(ravenueFormatter(1600000, 1)).toBe("1.6M")
})

test("60 minutes formatted to 1h 0m", () => {
  expect(runtimeFormatter(60)).toBe("1h 0m")
})

test("90 minutes formatted to 1h 30m", () => {
  expect(runtimeFormatter(90)).toBe("1h 30m")
})
