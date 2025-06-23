"use client";
import React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/backoffice/ui/table";
import { Button } from "@/components/backoffice/ui/button";
import { Input } from "@/components/backoffice/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/backoffice/ui/dropdown-menu";
import { AddFaqDialog } from "@/components/backoffice/custom/addFaqDialog";
import { Question, getColumns } from "./columns";

type DataTableProps = {
	initialFaqs: Question[];
	initialError?: boolean;
};

export function DataTable({ initialFaqs, initialError = false }: DataTableProps) {
	const [faqs, setFaqs] = React.useState<Question[]>(initialFaqs);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(initialError);
	const [openAdd, setOpenAdd] = React.useState(false);
	const [rowSelection, setRowSelection] = React.useState<{ [key: string]: boolean }>({});
	const [selectionMode, setSelectionMode] = React.useState(false);
	const [deleting, setDeleting] = React.useState(false);
	console.log(faqs);


	const fetchFaqs = async () => {
		setLoading(true);
		setError(false);
		try {
			const res = await fetch("/api/faq", { cache: "no-store" });
			if (!res.ok) throw new Error();
			let data = await res.json();
			data = data.sort((a: Question, b: Question) => b.id - a.id);
			setFaqs(data);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = React.useCallback(() => {
		fetchFaqs();
	}, []);

	const columns = React.useMemo(() => getColumns(handleChange), [handleChange]);

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

	const handleRowLongPress = (faqId: number) => {
		setSelectionMode(true);
		setRowSelection({ [faqId]: true });
	};

	const toggleRowSelection = (faqId: number) => {
		setRowSelection(prev => ({
			...prev,
			[faqId]: !prev[faqId]
		}));
	};

	const handleDeleteSelected = async () => {
		setDeleting(true);
		const ids = Object.entries(rowSelection)
			.filter(([_, selected]) => selected)
			.map(([id]) => Number(id));
		if (ids.length === 0) return;
		try {
			await fetch("/api/faq/delete", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ids }),
			});
			await fetchFaqs();
			setRowSelection({});
			setSelectionMode(false);
		} catch {
			alert("Erreur lors de la suppression");
		} finally {
			setDeleting(false);
		}
	};


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
							value={(table.getColumn("contenu")?.getFilterValue() as string) ?? ""}
							onChange={(event) =>
								table.getColumn("contenu")?.setFilterValue(event.target.value)
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
										{selectionMode && <TableHead />}
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
										<TableRow
											key={row.original.id}
											onPointerDown={() => {
												let timer = setTimeout(() => handleRowLongPress(row.original.id), 400);
												const clear = () => clearTimeout(timer);
												document.addEventListener("pointerup", clear, { once: true });
												document.addEventListener("pointerleave", clear, { once: true });
											}}
											onClick={() => {
												if (selectionMode) {
													toggleRowSelection(row.original.id);
												}
											}}
											style={{ cursor: selectionMode ? "pointer" : "default" }}
										>
											{selectionMode && (
												<TableCell>
													<input
														type="checkbox"
														checked={!!rowSelection[row.original.id]}
														onChange={() => toggleRowSelection(row.original.id)}
														onClick={e => e.stopPropagation()} // Empêche le double toggle si on clique sur la checkbox
													/>
												</TableCell>
											)}
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
			{selectionMode && (
				<div className="mb-2 flex gap-2">
					<Button
						variant="destructive"
						onClick={handleDeleteSelected}
						disabled={Object.values(rowSelection).every(v => !v) || deleting}
					>
						{deleting ? "Suppression..." : "Supprimer"}
					</Button>
					<Button variant="outline" onClick={() => { setSelectionMode(false); setRowSelection({}); }}>
						Annuler
					</Button>
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