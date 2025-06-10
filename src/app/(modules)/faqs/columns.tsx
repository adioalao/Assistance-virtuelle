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
	DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
								<AlertDialogDescription>
									{question.reponse}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Fermer</AlertDialogCancel>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Dialog open={editQuestion} onOpenChange={setEditQuestion}>
						<form>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Edit profile</DialogTitle>
									<DialogDescription>
										Make changes to your profile here. Click save when you&apos;re
										done.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4">
									<div className="grid gap-3">
										<Label htmlFor="name-1">Name</Label>
										<Input id="name-1" name="name" defaultValue="Pedro Duarte" />
									</div>
									<div className="grid gap-3">
										<Label htmlFor="username-1">Username</Label>
										<Input id="username-1" name="username" defaultValue="@peduarte" />
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button type="submit">Save changes</Button>
								</DialogFooter>
							</DialogContent>
						</form>
					</Dialog>
				</>
			)
		},
	},
]