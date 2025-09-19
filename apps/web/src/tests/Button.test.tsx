import Logo from "@/components/logo"
import { Button, ButtonProps } from "@/components/ui/button"
import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

const mockChild = vi.fn()
vi.mock("@/components/logo", () => ({
  default: (props: ButtonProps) => {
    mockChild(props)
    return (
      <span {...props} id="logo">
        Logo
      </span>
    )
  },
}))

describe("Button", () => {
  test("Renders", () => {
    render(<Button>Add</Button>)
    expect(screen.getByText("Add")).toBeDefined()
  })

  test("Passes props correctly", () => {
    render(
      <Button aria-label="logo" asChild>
        <Logo />
      </Button>,
    )

    expect(screen.getByText("Logo")).toBeDefined()

    expect(mockChild).toHaveBeenCalledWith(
      expect.objectContaining({
        "aria-label": "logo",
      }),
    )
  })
})

vi.resetAllMocks()
