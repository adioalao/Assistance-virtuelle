"use client"

import {
	Folder,
	MoreHorizontal,
	Share,
	Trash2,
	type LucideIcon,
} from "lucide-react"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { useSidebarData } from "./SidebarDataContext"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function NavProjects({
	projects,
}: {
	projects: {
		id: number
		name: string
		url: string
		icon: LucideIcon
	}[]
}) {
	const { isMobile } = useSidebar()
	const { removeSession } = useSidebarData()
	const router = useRouter()
	const pathname = usePathname()
	const [openDeleteAlert, setOpenDeleteAlert] = useState<number | null>(null)
	const [deletingId, setDeletingId] = useState<number | null>(null)

	const handleDelete = async (id: number) => {
		setDeletingId(id)
		try {
			const res = await fetch(`/api/discussion/${id}`, {
				method: "DELETE",
			})
			if (!res.ok) {
				// En cas d'erreur, on recharge pour rétablir l'état correct
				toast.error("Erreur lors de la suppression")
				// Ici, on pourrait aussi re-ajouter l'élément localement
				return null;
			}
			// Mise à jour optimiste - on retire immédiatement de l'interface
			removeSession(id)
			toast.success("Discussion supprimée")
			// Si on est sur la discussion supprimée, on redirige
			if (pathname && pathname.includes(`/chat/${id}`)) {
				router.push("/frontoffice/")
			}
		} catch (err) {
			toast.error("Erreur lors de la suppression")
			// En cas d'erreur réseau, recharger les données
		} finally {
			setDeletingId(null)
			setOpenDeleteAlert(null)
		}
	}

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Chats</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton asChild>
							<a href={item.url} className={deletingId === item.id ? "opacity-50" : ""}>
								<item.icon />
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem>
									<Folder className="text-muted-foreground" />
									<span>View Project</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Share className="text-muted-foreground" />
									<span>Share Project</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => setOpenDeleteAlert(item.id)}>
									<Trash2 className="text-muted-foreground" />
									<span>Supprimer</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}

				<AlertDialog open={openDeleteAlert !== null} onOpenChange={() => setOpenDeleteAlert(null)}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
							<AlertDialogDescription>
								Cette action est irréversible. La discussion sera définitivement supprimée.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Annuler</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => openDeleteAlert && handleDelete(openDeleteAlert)}
								disabled={deletingId !== null}
							>
								{deletingId !== null ? "Suppression..." : "Continuer"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<SidebarMenuItem>
					<SidebarMenuButton>
						<MoreHorizontal />
						<span>More</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}