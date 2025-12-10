import { Injectable } from "@nestjs/common";
import { Room } from "src/prisma/generated/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomsService {
	constructor(private readonly prismaService: PrismaService) {}

	private async findRoomBySlug(slug: string): Promise<Room | null> {
		return this.prismaService.room.findUnique({
			where: { slug },
		});
	}

	private async createRoomBySlug(slug: string): Promise<Room> {
		return this.prismaService.room.create({
			data: { slug },
		});
	}

	async findOrCreateRoomBySlug(slug: string): Promise<{ room: Room; created: boolean }> {
		let room = await this.findRoomBySlug(slug);
		let created = false;

		if (!room) {
			room = await this.createRoomBySlug(slug);
			created = true;
		}

		return { room, created };
	}
}
