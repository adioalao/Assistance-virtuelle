"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type ChatSession = {
   id: number
   title: string
   url: string
}

type SidebarDataContextType = {
   history: ChatSession[]
   refreshHistory: () => Promise<void>
   loading: boolean
   addSession: (session: ChatSession) => void
   removeSession: (sessionId: number) => void
}

const SidebarDataContext = createContext<SidebarDataContextType | undefined>(undefined)

export const SidebarDataProvider = ({ children }: { children: React.ReactNode }) => {
   const [history, setHistory] = useState<ChatSession[]>([])
   const [loading, setLoading] = useState(true)

   const fetchHistory = useCallback(async () => {
      try {
         setLoading(true)
         const res = await fetch("/api/history")
         if (!res.ok) throw new Error("Erreur chargement historique");
         const data = await res.json()
         
         const formattedHistory = data.map((d: ChatSession) => ({
            id: d.id,
            title: d.title?.slice(0, 25) || "(Sans titre)",
            url: `/frontoffice/chat/${d.id}`,
         }))
         
         setHistory(formattedHistory)
      } catch (err) {
         console.error("Erreur chargement historique :", err)
      } finally {
         setLoading(false)
      }
   }, [])

   // Méthode pour ajouter une session localement sans refetch
   const addSession = useCallback((session: ChatSession) => {
      setHistory(prev => [session, ...prev])
   }, [])

   // Méthode pour supprimer une session localement sans refetch
   const removeSession = useCallback((sessionId: number) => {
      setHistory(prev => prev.filter(session => session.id !== sessionId))
   }, [])

   useEffect(() => {
      fetchHistory()
   }, [fetchHistory])

   return (
      <SidebarDataContext.Provider value={{ 
         history, 
         refreshHistory: fetchHistory, 
         loading,
         addSession,
         removeSession
      }}>
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