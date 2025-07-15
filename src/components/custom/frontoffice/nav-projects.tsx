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
  // on récupère l'historique + la méthode pour le rafraîchir
  const { history, refreshHistory } = useSidebarData()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState<number | null>(null)


  const handleDelete = async (id: number) => {
    const confirmed = confirm("Voulez-vous vraiment supprimer cette discussion ?")
    if (!confirmed) return

    setLoading(id)

    try {
      const res = await fetch(`/api/discussion/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Discussion supprimée")
        // Si on est sur la discussion supprimée, on redirige vers /frontoffice
        if (pathname && pathname.includes(`/chat/${id}`)) {
          router.push("/frontoffice/")
        } else {
          router.refresh()
        }
      }
    } catch (err) {
      console.error("Suppression échouée", err)
      alert("Erreur réseau")
    } finally {
      setLoading(null)
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
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
                <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                  <Trash2 className="text-muted-foreground" />
                  <span>{loading === item.id ? "Suppression..." : "Supprimer"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
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