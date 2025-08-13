"use client"

import { useState, useEffect } from "react"
import { FaUser, FaUserShield } from "react-icons/fa"

interface Person {
  id: number
  nom: string
  prenom: string
  fonction: string
  matricule: string
  service?: string
  role?: string
}

export default function EmployePage() {
  const [activeTab, setActiveTab] = useState<"user" | "admin" | null>(null)
  const [users, setUsers] = useState<Person[]>([])
  const [admins, setAdmins] = useState<Person[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newPerson, setNewPerson] = useState<Person>({
    id: 0,
    nom: "",
    prenom: "",
    fonction: "",
    matricule: "",
    service: "",
    role: "",
  })
  const [deleting, setDeleting] = useState(false)
  const [selectedToDelete, setSelectedToDelete] = useState<number | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  const currentList = activeTab === "user" ? users : admins
  const setCurrentList = activeTab === "user" ? setUsers : setAdmins

  const handleAdd = () => {
    setNewPerson({
      id: Date.now(),
      nom: "",
      prenom: "",
      fonction: "",
      matricule: "",
      service: "",
      role: "",
    })
    setShowForm(true)
  }

  const handleSave = () => {
    const { nom, prenom, fonction, matricule, role, service } = newPerson
    const isAdmin = activeTab === "admin"
    const isValid = nom && prenom && fonction && matricule && (!isAdmin || role)

    if (!isValid) {
      alert("Veuillez remplir tous les champs obligatoires.")
      return
    }

    const cleanedPerson: Person = {
      id: newPerson.id,
      nom,
      prenom,
      fonction,
      matricule,
      ...(isAdmin ? { role } : { service }),
    }

    setCurrentList([...currentList, cleanedPerson])
    setShowForm(false)
  }

  const handleDeleteClick = () => {
    setDeleting(true)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const confirmDelete = (id: number) => {
    setSelectedToDelete(id)
  }

  const executeDelete = () => {
    if (selectedToDelete !== null) {
      const filtered = currentList.filter((p) => p.id !== selectedToDelete)
      setCurrentList(filtered)
      setSelectedToDelete(null)
      setDeleting(false)
    }
  }
  console.log('render', 'Employé');

  return (
    <div className="min-h-screen bg-white p-10 text-center">
      <h1 className="text-3xl font-bold mb-6"> Employé</h1>

      <div className="flex justify-center gap-10 mb-10">
        <button
          onClick={() => setActiveTab("user")}
          className="flex flex-col items-center bg-black text-white p-6 rounded-xl shadow-lg w-40 hover:bg-gray-800"
        >
          <FaUser size={40} />
          <span className="text-lg font-semibold mt-2">User</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className="flex flex-col items-center bg-black text-white p-6 rounded-xl shadow-lg w-40 hover:bg-gray-800"
        >
          <FaUserShield size={40} />
          <span className="text-lg font-semibold mt-2">Admin</span>
        </button>
      </div>

      {activeTab && (
        <div className="max-w-5xl mx-auto text-left">
          <table className="w-full border mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Nom</th>
                <th className="p-2">Prénom</th>
                <th className="p-2">Fonction</th>
                <th className="p-2">Matricule</th>
                {activeTab === "user" && <th className="p-2">Service</th>}
                {activeTab === "admin" && <th className="p-2">Rôle</th>}
              </tr>
            </thead>
            <tbody>
              {currentList.map((person) => (
                <tr
                  key={person.id}
                  className={`cursor-pointer ${deleting ? "hover:bg-red-100" : ""}`}
                  onClick={() => deleting && confirmDelete(person.id)}
                >
                  <td className="border p-2">{person.nom}</td>
                  <td className="border p-2">{person.prenom}</td>
                  <td className="border p-2">{person.fonction}</td>
                  <td className="border p-2">{person.matricule}</td>
                  {activeTab === "user" && <td className="border p-2">{person.service}</td>}
                  {activeTab === "admin" && <td className="border p-2">{person.role}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Ajouter {activeTab === "admin" ? "un admin" : "un utilisateur"}
            </button>

            <button
              onClick={handleDeleteClick}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Supprimer {activeTab === "admin" ? "un admin" : "un utilisateur"}
            </button>
          </div>

          {showNotification && (
            <p className="text-red-600 mt-2">Cliquez sur un élément à supprimer</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Ajouter {activeTab === "admin" ? "un admin" : "un utilisateur"}</h2>
            <input
              type="text"
              placeholder="Nom"
              className="border p-2 w-full mb-2"
              value={newPerson.nom}
              onChange={(e) => setNewPerson({ ...newPerson, nom: e.target.value })}
            />
            <input
              type="text"
              placeholder="Prénom"
              className="border p-2 w-full mb-2"
              value={newPerson.prenom}
              onChange={(e) => setNewPerson({ ...newPerson, prenom: e.target.value })}
            />
            <input
              type="text"
              placeholder="Fonction"
              className="border p-2 w-full mb-2"
              value={newPerson.fonction}
              onChange={(e) => setNewPerson({ ...newPerson, fonction: e.target.value })}
            />
            <input
              type="text"
              placeholder="Matricule"
              className="border p-2 w-full mb-2"
              value={newPerson.matricule}
              onChange={(e) => setNewPerson({ ...newPerson, matricule: e.target.value })}
            />
            {activeTab === "user" && (
              <input
                type="text"
                placeholder="Service"
                className="border p-2 w-full mb-2"
                value={newPerson.service}
                onChange={(e) => setNewPerson({ ...newPerson, service: e.target.value })}
              />
            )}
            {activeTab === "admin" && (
              <input
                type="text"
                placeholder="Rôle"
                className="border p-2 w-full mb-2"
                value={newPerson.role}
                onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
              />
            )}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedToDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <p className="mb-4">Voulez-vous vraiment supprimer cet élément ?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={executeDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Oui
              </button>
              <button
                onClick={() => setSelectedToDelete(null)}
                className="px-4 py-2 border rounded"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
