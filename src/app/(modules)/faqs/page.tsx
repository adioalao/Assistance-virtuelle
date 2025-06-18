import { columns, Question } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Question[]> {
	let data: Question[] = [];
	try {
		const res = await fetch("http://localhost:4000/api/faqs", { cache: "no-store" });
		if (!res.ok) return data;
		data = await res.json();
		return data;
	} catch (e) {
		return data;
	}
}

export default async function FAQs() {
	// const data: Question[] | string = await getData();
	const data: Question[] | string = []
	console.log(data);


	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	);
}
