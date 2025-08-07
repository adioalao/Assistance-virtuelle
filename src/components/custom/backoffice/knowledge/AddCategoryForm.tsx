"use client"

import React, { useState } from "react"

export default function AddCategoryForm({
  onAdd,
  onCancel
}: {
  onAdd: (cat: { id: number; name: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")

  const handleSubmit = () => {
    if (name.trim() === "") {
      alert("Le nom de la catégorie est requis.")
      return
    }
    onAdd({ id: Date.now(), name })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Ajouter une catégorie</h2>
        <input
          type="text"
          className="border px-3 py-2 w-full rounded mb-4"
          placeholder="Nom de la catégorie"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>Annuler</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}
