import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/custom/frontoffice/app-sidebar"
import { ModeToggle } from "@/components/custom/backoffice/toggleTheme"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { SidebarDataProvider } from "@/components/custom/frontoffice/SidebarDataContext"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "user") {
    redirect("/unauthorized")
  }

  return (
    <SidebarProvider>
      <SidebarDataProvider>
        {/* 👇 On passe le vrai user ici */}
        <AppSidebar
          user={{

            name: session.user.name ?? "User",
            email: session.user.email ?? "user@example.com",
            avatar: "/avatars/shadcn.jpg", // tu peux le récupérer depuis ta BDD si tu l’as
          }}
        />
        <SidebarInset>
          <Toaster />
          <header className="flex justify-between h-16 shrink-0 items-center gap-2 w-full">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
            <div className="mx-4">
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 px-4 pt-0 w-full max-w-full">
            {children}
          </div>
        </SidebarInset>
      </SidebarDataProvider>
    </SidebarProvider>
  )
}
