"use client";
import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/back-office/ui/dropdown-menu";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/back-office/ui/table";

import {Button} from "@/components/back-office/ui/button";
import {Input} from "@/components/back-office/ui/input";


import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/back-office/ui/select";
import {AddFaqDialog} from "@/components/back-office/custom/addFaqDialog";


interface DataTableProps<TData extends { categorie?: string }, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData extends {
	categorie?: string;
}, TValue>({
	           columns,
	           data
           }: DataTableProps<TData, TValue>) {
	// Ajoute un état local pour les FAQs
	const [faqs, setFaqs] = React.useState(data);
	const [selectCategory, setSelectCategory] = React.useState<string>("");
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [openAdd, setOpenAdd] = React.useState(false);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		}

	});

	React.useEffect(() => {
		const column = table.getColumn("categorie");
		if (selectCategory === "all") {
			column?.setFilterValue("");
		} else {
			column?.setFilterValue(selectCategory);
		}
	}, [selectCategory]);

	// Ajout d'une FAQ
	const handleAddFaq = React.useCallback(async (question: string, reponse: string, categorie?: string) => {
		try {
			// Appel API pour ajouter la FAQ
			const res = await fetch("/api/faqs", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({question, reponse, categorie})

			});
			if (!res.ok) throw new Error("Erreur lors de l'ajout");
			const newFaq = await res.json();
			// Ajoute la nouvelle FAQ à la liste locale
			setFaqs((prev) => [...prev, newFaq]);
		} catch (e) {
			alert("Erreur lors de l'ajout de la FAQ");
		}
		setOpenAdd(false);
	}, []);
	console.log("Render : DataTable");


	return (
		<div>
			<div className="flex justify-end">
				<Button variant="default" size="lg" className="text-lg bg-blue-600 hover:bg-blue-600 hover:scale-105"
				        onClick={() => setOpenAdd(true)}>
					Ajouter FAQs
				</Button>
			</div>
			<div className="flex justify-between items-center py-4">
				<Input
					placeholder="Recherche de questions . . ."
					value={(table.getColumn("question")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("question")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="flex gap-2 items-center">
					<Select onValueChange={(value) => {
						setSelectCategory(value);
						table.getColumn("categorie")?.setFilterValue(value);
					}}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Catégorie"/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Toutes les catégories</SelectItem>
							{[...new Set(
								data
									.map((item) => item.categorie)
									.filter((cat): cat is string => typeof cat === "string" && cat.length > 0)
							)].map((cat) => (
								<SelectItem key={cat} value={cat}>{cat}</SelectItem>
							))}
						</SelectContent>
					</Select>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Colonnes visibles
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter(
									(column) => column.getCanHide()
								)
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Pas de résultats
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Précédent
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Suivant
				</Button>
			</div>

			<AddFaqDialog
				open={openAdd}
				onClose={() => setOpenAdd(false)}
				onAdd={handleAddFaq}
			/>
		</div>
	);
}