"use client"

import { useParams } from "next/navigation"
import React, { useState } from "react"

export default function ArticlePage() {
  const { id } = useParams()
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Article #{id}</h1>

      {/* Si l’article est vide */}
      {content === "" && !file ? (
        <p className="text-gray-600 mb-4">Cet article est vide.</p>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="font-semibold text-lg">Contenu :</h2>
            <p>{content}</p>
          </div>

          {file && (
            <div className="mb-4">
              <h2 className="font-semibold text-lg">Fichier joint :</h2>
              <a
                href={URL.createObjectURL(file)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Voir le fichier
              </a>
            </div>
          )}
        </>
      )}

      {/* Édition */}
      <div className="mt-6 space-y-4">
        <textarea
          placeholder="Écrire le contenu ici..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 p-4 rounded-md"
          rows={6}
        />

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) setFile(e.target.files[0])
          }}
        />

        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => alert("Contenu sauvegardé (non persistant pour l'instant)")}
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}
