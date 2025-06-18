"use client"

import * as React from "react"
import {
  Brain,
  Command,
  HelpCircleIcon,
  HistoryIcon,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  PieChart,
  Send,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/back-office/nav-main"
import { NavProjects } from "@/components/back-office/nav-projects"
import { NavSecondary } from "@/components/back-office/nav-secondary"
import { NavUser } from "@/components/back-office/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/back-office/ui/sidebar"
import Image from "next/image"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true
    },
    {
      title: "FAQs",
      url: "faqs",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
