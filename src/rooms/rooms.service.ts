import { Injectable, NotFoundException } from "@nestjs/common";
import { Room } from "src/prisma/generated/client";
import { PrismaService } from "src/prisma/prisma.service";
import { Stroke } from "./dto/stroke.dto";

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

	async saveStrokeToRoom(slug: string, stroke: Stroke): Promise<void> {
		const room = await this.findRoomBySlug(slug);
		if (!room) return;

		const strokes = Array.isArray(room.strokes) ? room.strokes : [];
		strokes.push(stroke as any);

		await this.prismaService.room.update({
			where: { slug },
			data: { strokes },
		});
	}

	async clearStrokesInRoom(slug: string): Promise<void> {
		const room = await this.findRoomBySlug(slug);
		if (!room) return;

		await this.prismaService.room.update({
			where: { slug },
			data: { strokes: [] },
		});
	}
}
