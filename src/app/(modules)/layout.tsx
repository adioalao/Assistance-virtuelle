import { AppSidebar } from "../../components/back-office/app-sidebar"
import Pathname from "@/components/back-office/custom/pathname"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/back-office/ui/breadcrumb"
import { Separator } from "@/components/back-office/ui/separator"
import {
	Sidebar,
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/back-office/ui/sidebar"

export default function Page({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<Sidebar />
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
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
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
