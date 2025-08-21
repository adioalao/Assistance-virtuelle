"use client"

import * as React from "react"
import {
  Brain,
  HelpCircleIcon,
  HistoryIcon,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  PieChart,
  Send,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/custom/frontoffice/nav-main"
import { NavProjects } from "@/components/custom/frontoffice/nav-projects"
import { NavSecondary } from "@/components/custom/frontoffice/nav-secondary"
import { NavUser } from "@/components/custom/frontoffice/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

type ChatSession = {
  id: number
  title: string
  createdAt: string
}

const data = {
  navMain: [
    {
      title: "Nouveau Chat",
      url: "/frontoffice",
      icon: LayoutDashboard,
      isActive: true
    },
  ],
  /*
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Analyse de données",
      url: "#",
      icon: LineChart,
    },
    {
      name: "Base de connaissances  ",
      url: "#",
      icon: PieChart,
    },
    {
      name: "LLM",
      url: "#",
      icon: Brain,
    },
  ],
  */
}

export function AppSidebar({ user, ...props }: {
  user: {
    username: string
    email: string
    avatar: string
  }
} &
  React.ComponentProps<typeof Sidebar>) {
  const [historyItems, setHistoryItems] = React.useState<{ id: number, name: string, url: string }[]>([])


  React.useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const res = await fetch("/api/history")
        if (!res.ok) return { error: "Erreur lors de la récupération de l'historique" }
        const data: ChatSession[] = await res.json()
        setHistoryItems(data.map(session => ({
          id: session.id,
          name: session.title?.slice(0, 25) || "(Sans titre)",
          url: `/frontoffice/chat/${session.id}`,
        })))
      } catch (err) {
        console.error("Erreur chargement historique :", err)
      }
    }

    fetchDiscussions()
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="https://portdecotonou.bj/">
                <Image src="/logoPort.png" alt="Logo du Port" width={150} height={20} />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects
          projects={historyItems.map(item => ({
            id: item.id,
            name: item.name,
            url: item.url,
            icon: HistoryIcon,
          }))}
        />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
