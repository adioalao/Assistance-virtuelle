"use client"

import React, { useState } from "react"
import Link from "next/link"
import AddArticleForm from "./AddArticleForm"

interface Article {
  id: number
  title: string
}

interface CategoryProps {
  name: string
  categoryId: number
  articles: Article[]

}

export default function CategorySection({ name, articles }: CategoryProps) {
  const [articleList, setArticleList] = useState<Article[]>(articles)
  const [showAddForm, setShowAddForm] = useState(false)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 5

  const filteredArticles = articleList.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredArticles.length / perPage)
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
      setArticleList(prev => prev.filter(a => a.id !== id))
    }
  }

  const handleAdd = (article: Article) => {
    setArticleList(prev => [...prev, article])
    setShowAddForm(false)
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-blue-800 mb-2">{name}</h2>

      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          placeholder="Rechercher un article..."
          className="border px-3 py-2 rounded-md shadow-sm w-1/2"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddForm(true)}
        >
          Ajouter un article
        </button>
      </div>

      <ul className="space-y-2">
        {paginatedArticles.map(article => (
          <li
            key={article.id}
            className="flex justify-between items-center p-3 bg-gray-100 rounded hover:bg-gray-200"
          >
            <span className="font-medium text-gray-800">{article.title}</span>
            <div className="space-x-2">
              <Link
                href={`/base-connaissances/article/${article.id}`}
                className="text-blue-600 underline"
              >
                Consulter
              </Link>
              <button
                className="text-red-500 underline"
                onClick={() => handleDelete(article.id)}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-end mt-3 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-2 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddArticleForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
      )}
    </div>
  )
}
