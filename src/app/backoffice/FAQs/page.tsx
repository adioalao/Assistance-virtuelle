"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { Question } from "./columns";

export default function FAQs() {
	const [faqs, setFaqs] = useState<Question[]>([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	async function fetchFaqs() {
		try {
			setLoading(true);
			setError(false);
			const res = await fetch("/api/faq", { cache: "no-store" });
			if (!res.ok) throw new Error();
			const data = await res.json();
			setFaqs(data);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchFaqs();
	}, []);

	if (loading) return <p>Chargement...</p>;
	if (error) return <p>Erreur de chargement, <button onClick={fetchFaqs}>Réessayer</button></p>;

	return (
		<div className="container mx-auto py-10">
			<DataTable initialFaqs={faqs} />
		</div>
	);
}