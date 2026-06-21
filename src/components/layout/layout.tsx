import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { AppSidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-svh flex-1 flex-col">
        <TopBar />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  )
}
