import { AppSidebar } from "@/components/backoffice/app-sidebar"
import Pathname from "@/components/backoffice/custom/pathname"
import { ModeToggle } from "@/components/backoffice/custom/toggleTheme"
import {
	Breadcrumb,
} from "@/components/backoffice/ui/breadcrumb"
import { Separator } from "@/components/backoffice/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/backoffice/ui/sidebar"

export default function Page({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
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

