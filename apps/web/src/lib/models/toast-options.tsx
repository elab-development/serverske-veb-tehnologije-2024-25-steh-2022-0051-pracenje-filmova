export class ToastOptions {
  variant: "destructive" | "default" = "default"
  title: string = "Alert"
  description?: string = undefined
  duration: number = 3000
  action?: JSX.Element

  constructor(options?: Partial<ToastOptions>) {
    this.variant = "default"
    this.title = "Alert"
    this.description = undefined
    this.duration = 3000
    Object.assign(this, options)
  }

  public static create(v?: "destructive" | "default") {
    if (v !== "destructive" && v !== "default")
      return new ToastOptions({ variant: "default" })
    return new ToastOptions({ variant: v })
  }

  public setTitle(title: string) {
    this.title = title
    return this
  }

  public setDescription(description: string) {
    this.description = description
    return this
  }

  public setDuration(duration: number) {
    this.duration = duration
    return this
  }

  public setVariant(variant: "destructive" | "default") {
    this.variant = variant
    return this
  }

  public setAction(action: JSX.Element) {
    this.action = action
    return this
  }

  public static createDestructive() {
    return new ToastOptions({ variant: "destructive" })
  }

  public static createDefault() {
    return new ToastOptions({ variant: "default" })
  }
}
