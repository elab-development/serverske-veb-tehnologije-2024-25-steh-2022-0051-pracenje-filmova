import { PropsWithChildren } from "react"
import { Outlet, ScrollRestoration } from "react-router-dom"
import { Toaster } from "../ui/toaster"
import Footer from "./footer"
import Navbar from "./navbar/navbar"
import { Sidebar } from "./sidebar"

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="border-b">
          <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <Sidebar />
            <main className="relative min-h-[calc(100svh-3.5rem)] py-6 lg:gap-10 lg:py-8">
              {children ?? <Outlet />}
            </main>
          </div>
          <Footer />
        </div>
      </main>
      <Toaster />
      <ScrollRestoration />
    </div>
  )
}

export default Layout
