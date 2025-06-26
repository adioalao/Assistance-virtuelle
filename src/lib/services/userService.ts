import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const userService = {
	async getAllUser() {
		return prisma.user.findMany();
	},

	async addUser(name: string, email: string, password: string, roleId: number) {
		const hashedPassword = await bcrypt.hash(password, 10);

		return prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				roleId
			}
		});
	},

	async getUserById(id: number) {
		return prisma.user.findMany({
			where: { id },
			include: { role: true }
		});
	},

	async getUserByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email },
			include: { role: true }
		});
	},

	async updateUser(id: number, data: {
		name?: string;
		email?: string;
		password?: string;
		roleId?: number;
	}) {
		if (data.password) {
			data.password = await bcrypt.hash(data.password, 10);
		}

		return prisma.user.update({
			where: { id },
			data
		});
	},

	async deleteUser(id: number) {
		return prisma.user.delete({
			where: { id }
		});
	},

	async verifyPassword(password: string, hashedPassword: string) {
		return bcrypt.compare(password, hashedPassword);
	}
};