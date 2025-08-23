"use client"

import * as React from "react"
import {
  HistoryIcon,
  LayoutDashboard,
} from "lucide-react"

import { NavMain } from "@/components/custom/frontoffice/nav-main"
import { NavProjects } from "@/components/custom/frontoffice/nav-projects"
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
import { getErrorMessage } from "@/utils/error-handler"
import { useSidebarData } from "./SidebarDataContext"

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
  const { history: historyItems } = useSidebarData()

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
            name: item.title,
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
