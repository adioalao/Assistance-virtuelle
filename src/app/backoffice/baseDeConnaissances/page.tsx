"use client"

import React, { useState } from "react"
import CategorySection from "@/components/custom/backoffice/knowledge/CategorySection"
import AddCategoryModal from "@/components/custom/backoffice/knowledge/AddCategoryModal"

interface Article {
  id: number
  title: string
}

interface Category {
  id: number
  name: string
  articles: Article[]
}

export default function BaseConnaissances() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Procédures",
      articles: [
        { id: 1, title: "Procédure d'importation" },
        { id: 2, title: "Procédure de sécurité" },
        { id: 3, title: "Procédure de nettoyage" },
      ],
    },
    {
      id: 2,
      name: "Sécurité",
      articles: [
        { id: 4, title: "Politique de sécurité réseau" },
        { id: 5, title: "Gestion des incidents" },
      ],
    },
  ])

  const [showAddCategory, setShowAddCategory] = useState(false)
  const [search, setSearch] = useState("")

  // Ajouter une nouvelle catégorie
  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: categories.length + 1,
      name,
      articles: [],
    }
    setCategories([...categories, newCategory])
    setShowAddCategory(false)
  }

  // Supprimer une catégorie
  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Base de Connaissances</h1>

      {/* Barre de recherche + bouton ajouter une catégorie */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddCategory(true)}
        >
          + Ajouter une catégorie
        </button>
      </div>

      {/* Liste des catégories filtrées */}
      {filteredCategories.length === 0 ? (
        <p className="text-gray-500">Aucune catégorie trouvée.</p>
      ) : (
        filteredCategories.map((cat) => (
          <CategorySection
            key={cat.id}
            categoryId={cat.id}
            name={cat.name}
            articles={cat.articles}
          // onDeleteCategory={handleDeleteCategory}
          />
        ))
      )}

      {/* Modal d’ajout de catégorie */}
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onSave={handleAddCategory}
        />
      )}
    </div>
  )
}
