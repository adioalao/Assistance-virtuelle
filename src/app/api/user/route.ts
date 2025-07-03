import { userService } from "@/lib/services/userService";
import { NextRequest, NextResponse } from "next/server";

const jsonHeaders = {
	'Content-Type': 'application/json',
};

export async function GET() {
	try {
		const users = await userService.getAllUser();
		if (!users) {
			return NextResponse.json(
				{ reponse: "Pas d'utilisateur" },
				{ status: 404, headers: jsonHeaders }
			);
		}
		return NextResponse.json(users, { headers: jsonHeaders })
	} catch (error) {
		return NextResponse.json({ error: 'Erreur lors de la récuperation des données' }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	const { name, email, password, roleId }:
		{
			name: string,
			email: string,
			password: string,
			roleId: number
		}
		= await req.json();
	const test = await userService.getUserByEmail(email)
	if (test) {
		return NextResponse.json({ error: 'Un utilisateur utilise déjà ce email' }, { status: 409 })
	}
	if (!email || !password) {
		return NextResponse.json({ error: 'Email et password sont requis' }, { status: 400 })
	}
	const post = await userService.addUser(name, email, password, roleId);
	return NextResponse.json(post, { status: 201, headers: jsonHeaders })
}
