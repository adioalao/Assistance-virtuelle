"use client"

import React from "react"

interface Article {
  id: number
  title: string
}

export default function ArticleModal({ article, onClose }: { article: Article, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Article : {article.title}</h2>
        <p className="text-gray-600">Contenu de l’article : (en développement)</p>

        <div className="flex justify-end mt-6 space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}
