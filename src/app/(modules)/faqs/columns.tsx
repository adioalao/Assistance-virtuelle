"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Question = {
	id: string
	categorie: string
	question: string
	reponse: string
	dateCreation: string
	dateModification: string
}

export const columns: ColumnDef<Question>[] = [
	{
		accessorKey: "question",
		header: "Question",
		cell: ({ row }) => (
			<div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] whitespace-pre-wrap break-words">
				{row.getValue("question")}
			</div>
		),
	},
	{
		accessorKey: "categorie",
		header: "Catégorie",
	},
	{
		accessorKey: "dateCreation",
		header: "Date de Création",
	},
	{
		accessorKey: "dateModification",
		header: "Date de dernière modification",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const question = row.original
			const [openResponse, setOpenResponse] = React.useState(false)
			const [editQuestion, setEditQuestion] = React.useState(false)

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
							<DropdownMenuItem onClick={() => setEditQuestion(true)}>
								Editer
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setOpenResponse(true)}>
								Voir Réponse
							</DropdownMenuItem>
							<DropdownMenuItem>Supprimer</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<AlertDialog open={openResponse} onOpenChange={setOpenResponse}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Réponse à la question</AlertDialogTitle>
								<AlertDialogDescription className="max-h-64 overflow-auto text-black whitespace-pre-line">
									{question.reponse}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Fermer</AlertDialogCancel>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Dialog open={editQuestion} onOpenChange={setEditQuestion}>
						<form className="w-full">
							<DialogContent className="sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Modifier la question</DialogTitle>
									<DialogDescription>
										Modifiez la question et sa réponse, puis cliquez sur "Enregistrer".
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-6 py-4">
									<div className="grid gap-2">
										<Label htmlFor="question-1">Question</Label>
										<Textarea
											id="question-1"
											name="question"
											defaultValue={question.question}
											className="w-full min-h-[80px]"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="reponse-1">Réponse</Label>
										<Textarea
											id="reponse-1"
											name="reponse"
											defaultValue={question.reponse}
											className="w-full min-h-[120px]"
										/>
									</div>
								</div>
								<DialogFooter className="flex flex-row gap-2 justify-end">
									<DialogClose asChild>
										<Button variant="outline" type="button">
											Annuler
										</Button>
									</DialogClose>
									<Button type="submit">Enregistrer</Button>
								</DialogFooter>
							</DialogContent>
						</form>
					</Dialog>
				</>
			)
		},
	},
]