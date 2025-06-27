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

import { NavMain } from "@/components/backoffice/nav-main"
import { NavProjects } from "@/components/backoffice/nav-projects"
import { NavSecondary } from "@/components/backoffice/nav-secondary"
import { NavUser } from "@/components/backoffice/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/backoffice/ui/sidebar"
import Image from "next/image"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "Dashboard",
      icon: LayoutDashboard,
      isActive: true
    },
    {
      title: "FAQs",
      url: "FAQs",
      icon: HelpCircleIcon,
    },
    {
      title: "Employé",
      url: "employe",
      icon: Users,
    },
    {
      title: "Historique",
      url: "historique",
      icon: HistoryIcon,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
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
}

export function AppSidebar({ user, ...props }: {
  user: {
    name: string
    email: string
    avatar: string
  }
} &
  React.ComponentProps<typeof Sidebar>) {
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
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
