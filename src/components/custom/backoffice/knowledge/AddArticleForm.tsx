"use client"

import React, { useState } from "react"

export default function AddArticleForm({ onAdd, onCancel }: { onAdd: (a: { id: number, title: string }) => void, onCancel: () => void }) {
  const [title, setTitle] = useState("")

  const handleSubmit = () => {
    if (title.trim() === "") {
      alert("Le titre de l’article est requis.")
      return
    }

    onAdd({ id: Date.now(), title })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Ajouter un article</h2>
        <input
          type="text"
          className="border px-3 py-2 w-full rounded mb-4"
          placeholder="Titre de l’article"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>Annuler</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}
