import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import Pathname from "@/components/custom/backoffice/pathname"
import { ModeToggle } from "@/components/custom/backoffice/toggleTheme"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function Layout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== "admin") {
		redirect("/unauthorized")
	}

	return (
		<SidebarProvider>
			{/* 👇 On passe le vrai user ici */}
			<AppSidebar
				user={{
					name: session.user.name ?? "Admin",
					email: session.user.email ?? "admin@example.com",
					avatar: "/avatars/shadcn.jpg", // tu peux le récupérer depuis ta BDD si tu l’as
				}}
			/>
			<SidebarInset>
				<header className="flex justify-between h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<Pathname />
						</Breadcrumb>
					</div>
					<div className="mx-4">
						<ModeToggle />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}