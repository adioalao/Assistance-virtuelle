"use client"

import React, { useState } from "react"

interface Props {
  onClose: () => void
  onSave: (name: string) => void
}

export default function AddCategoryModal({ onClose, onSave }: Props) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSave = () => {
    if (name.trim() === "") {
      setError("Le nom de la catégorie est requis.")
      return
    }
    onSave(name.trim())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Ajouter une catégorie</h2>
        
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError("")
          }}
          placeholder="Nom de la catégorie"
          className="w-full border border-gray-300 px-4 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
