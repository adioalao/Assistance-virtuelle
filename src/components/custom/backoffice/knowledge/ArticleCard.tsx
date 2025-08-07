"use client"

import React from "react"

interface ArticleCardProps {
  title: string
  onEdit: () => void
  onDelete: () => void
  onView: () => void
}

export default function ArticleCard({ title, onEdit, onDelete, onView }: ArticleCardProps) {
  return (
    <div className="bg-white border p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div className="flex gap-2 mt-2">
        <button onClick={onView} className="text-blue-600 hover:underline text-sm">Voir</button>
        <button onClick={onEdit} className="text-yellow-600 hover:underline text-sm">Modifier</button>
        <button onClick={onDelete} className="text-red-600 hover:underline text-sm">Supprimer</button>
      </div>
    </div>
  )
}
