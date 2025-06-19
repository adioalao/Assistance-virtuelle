"use client";
import React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddFaqDialog } from "@/components/custom/addFaqDialog";
import { Question, columns } from "./columns";

type DataTableProps = {
	initialFaqs: Question[];
	columns: typeof columns;
	initialError?: boolean;
};

export function DataTable({ initialFaqs, columns, initialError = false }: DataTableProps) {
	const [faqs, setFaqs] = React.useState<Question[]>(initialFaqs);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(initialError);
	const [openAdd, setOpenAdd] = React.useState(false);
	// Rafraîchir la liste après ajout
	const fetchFaqs = React.useCallback(async () => {
		setLoading(true);
		setError(false);
		try {
			const res = await fetch("http://localhost:4000/api/faqs", { cache: "no-store" });
			if (!res.ok) throw new Error();
			const data = await res.json();
			setFaqs(data);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}

	}, []);

	// Table setup
	const table = useReactTable({
		data: faqs,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {},
	});


	return (
		<div>
			<div className="flex justify-between m-2">
				<h1 className="text-3xl">Gestion des FAQS</h1>
				<Button variant="default" size="lg" className="text-lg bg-blue-600 hover:bg-blue-600 hover:scale-105"
					onClick={() => setOpenAdd(true)}>
					Ajouter FAQs
				</Button>
			</div>
			{error ? (
				<div className="flex flex-col items-center justify-center py-32">
					<p className="text-xl text-red-500 m-3">Erreur lors du chargement des questions.</p>
					<Button onClick={fetchFaqs}>Réessayer</Button>
				</div>
			) : loading ? (
				<div className="flex flex-col items-center justify-center py-32">
					<p className="text-xl text-gray-500">Chargement...</p>
				</div>
			) : faqs.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-32">
					<p className="text-xl text-gray-500">Aucune question trouvée.</p>
					<p className="text-sm text-gray-400">Ajoutez une FAQ pour commencer.</p>
				</div>
			) : (
				<div>
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
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="ml-auto">
										Colonnes visibles
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{table
										.getAllColumns()
										.filter((column) => column.getCanHide())
										.map((column) => (
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
										))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
											</TableHead>
										))}
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
				</div>
			)}
			<AddFaqDialog
				open={openAdd}
				onClose={() => setOpenAdd(false)}
				onFaqAdded={fetchFaqs}
			/>
		</div>
	);
}