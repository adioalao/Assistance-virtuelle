import { userService } from "@/lib/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const id = parseInt(params.id, 10)
	try {
		const user = await userService.getUserById(id)
		if (!user) {
			return NextResponse.json(
				{ reponse: "utilisateur introuvable" },
				{ status: 404 }
			);
		}
		return NextResponse.json(user)
	} catch (error) {
		return NextResponse.json(
			{ error: "Erreur serveur lors de l'ajout" },
			{ status: 500 }
		);
	}
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	const id = parseInt(params.id, 10)
	const { name, email, password, roleId }: { name?: string, email?: string, password?: string, roleId?: number } = await req.json();
	try {
		const update = await userService.updateUser(id, { name, email, password, roleId });
		return NextResponse.json(update)
	} catch (error) {
		return NextResponse.json(
			{ error: "Erreur serveur lors de la mise à jour" },
			{ status: 500 }
		)
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	const id = parseInt(params.id, 10)
	try {
		const del = await userService.deleteUser(id)
		return NextResponse.json(del)
	} catch (error) {
		return NextResponse.json(
			{ error: "Erreur serveur lors de la suppression" },
			{ status: 500 }
		)
	}

}