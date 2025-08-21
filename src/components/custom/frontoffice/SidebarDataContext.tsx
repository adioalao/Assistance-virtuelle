"use client"

import { createContext, useContext, useEffect, useState } from "react"

type ChatSession = {
   id: number
   title: string
   url: string
}

type SidebarDataContextType = {
   history: ChatSession[]
   refreshHistory: () => Promise<void | null>
}

const SidebarDataContext = createContext<SidebarDataContextType | undefined>(undefined)

export const SidebarDataProvider = ({ children }: { children: React.ReactNode }) => {
   const [history, setHistory] = useState<ChatSession[]>([])

   const fetchHistory = async () => {
      try {
         const res = await fetch("/api/history")
         if (!res.ok) return null;
         const data = await res.json()
         setHistory(
            data.map((d: any) => ({
               id: d.id,
               title: d.title?.slice(0, 25) || "(Sans titre)",
               url: `/frontoffice/chat/${d.id}`,
            }))
         )
      } catch (err) {
         console.error("Erreur chargement historique :", err)
      }
   }

   useEffect(() => {
      fetchHistory()
   }, [])

   return (
      <SidebarDataContext.Provider value={{ history, refreshHistory: fetchHistory }}>
         {children}
      </SidebarDataContext.Provider>
   )
}

export const useSidebarData = () => {
   const context = useContext(SidebarDataContext)
   if (!context) {
      throw new Error("useSidebarData doit être utilisé dans SidebarDataProvider")
   }
   return context
}