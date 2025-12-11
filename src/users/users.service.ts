import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, User } from "src/prisma/generated/client";

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { email } });
	}

	async findById(id: number): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { id } });
	}

	async createUser(email: string, passwordHash: string): Promise<User> {
		return this.prisma.user.create({
			data: { email, passwordHash },
		});
	}

	async upsertUser(email: string, passwordHash: string): Promise<User> {
		return this.prisma.user.upsert({
			where: { email },
			update: { passwordHash },
			create: { email, passwordHash },
		});
	}

	async listUsers(params?: Prisma.UserFindManyArgs): Promise<User[]> {
		return this.prisma.user.findMany(params);
	}
}
