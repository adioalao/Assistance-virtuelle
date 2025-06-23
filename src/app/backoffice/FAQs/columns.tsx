"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React, { useState } from "react"

import { Button } from "@/components/backoffice/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/backoffice/ui/dropdown-menu"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/backoffice/ui/alert-dialog"

import { UpdateFaq } from "@/components/backoffice/custom/updateFaq"

export type Question = {
	id: number
	contenu: string
	reponse: { contenu: string } | null
	children?: Question[]
}

// Fonction qui prend un callback et retourne les colonnes
export function getColumns(onChange: () => void): ColumnDef<Question>[] {
	return [
		{
			accessorKey: "contenu",
			header: "Question",
			cell: ({ row }) => (
				<div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] whitespace-pre-wrap break-words">
					{row.original.contenu}
				</div>
			),
		},
		{
			accessorKey: "reponse",
			header: "Réponse",
			cell: ({ row }) => {
				const reponse = row.original.reponse?.contenu ?? ""
				const maxLength = 80
				return (
					<div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] whitespace-pre-wrap break-words">
						{reponse.length > maxLength
							? reponse.slice(0, maxLength) + "..."
							: reponse}
					</div>
				)
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const question = row.original
				const [openEdit, setOpenEdit] = React.useState(false)
				const [openResponse, setOpenResponse] = React.useState(false)
				const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false)
				const [loadingDelete, setLoadingDelete] = React.useState(false)
				const [errorDelete, setErrorDelete] = React.useState("")

				const handleDelete = async () => {
					setLoadingDelete(true)
					setErrorDelete("")
					try {
						const res = await fetch("/api/faq/delete", {
							method: "DELETE",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ ids: [question.id] }),
						})
						if (!res.ok) throw new Error("Erreur lors de la suppression")
						setOpenDeleteAlert(false)
						onChange() // Notifie le parent
					} catch (e) {
						setErrorDelete("Erreur lors de la suppression")
					} finally {
						setLoadingDelete(false)
					}
				}

				return (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem onClick={() => setOpenEdit(true)}>
									Editer
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setOpenResponse(true)}>
									Voir Réponse
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setOpenDeleteAlert(true)}>
									Supprimer
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<AlertDialog open={openResponse} onOpenChange={setOpenResponse}>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Réponse à la question</AlertDialogTitle>
									<AlertDialogDescription className="max-h-64 overflow-auto text-black whitespace-pre-line">
										{question.reponse?.contenu ?? ""}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Fermer</AlertDialogCancel>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
						<AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Supprimer la FAQ ?</AlertDialogTitle>
									<AlertDialogDescription>
										Cette action est irréversible. Voulez-vous vraiment supprimer
										cette FAQ ?
									</AlertDialogDescription>
								</AlertDialogHeader>
								{errorDelete && (
									<div className="text-red-500 text-sm mb-2">{errorDelete}</div>
								)}
								<AlertDialogFooter>
									<AlertDialogCancel disabled={loadingDelete}>
										Annuler
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDelete}
										disabled={loadingDelete}
									>
										{loadingDelete ? "Suppression..." : "Supprimer"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
						<UpdateFaq
							open={openEdit}
							onClose={() => setOpenEdit(false)}
							onFaqUpdate={onChange}
							id_FAQ={question.id}
							initialQuestion={question.contenu}
							initialReponse={question.reponse?.contenu ?? ""}
						/>
					</>
				)
			},
		},
	]
}