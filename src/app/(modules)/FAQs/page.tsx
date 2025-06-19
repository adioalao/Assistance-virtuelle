import { DataTable } from "./data-table";
import { columns, Question } from "./columns";

async function getFaqs(): Promise<{ faqs: Question[]; error: boolean }> {
	try {
		const res = await fetch("http://localhost:4000/api/faqs", { cache: "no-store" });
		if (!res.ok) return { faqs: [], error: true };
		const faqs = await res.json();
		return { faqs, error: false };
	} catch {
		return { faqs: [], error: true };
	}
}

export default async function FAQs() {
	const { faqs, error } = await getFaqs();
	return (
		<div className="container mx-auto py-10">
			<DataTable initialFaqs={faqs} columns={columns} initialError={error} />
		</div>
	);
}
