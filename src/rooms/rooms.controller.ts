import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import type { Response } from "express";

@Controller("rooms")
export class RoomsController {
	constructor(private readonly roomsService: RoomsService) {}

	@Get(":slug")
	async getRoom(@Param("slug") slug: string, @Res() res: Response) {
		const { room, created } = await this.roomsService.findOrCreateRoomBySlug(slug);
		return res.status(created ? HttpStatus.CREATED : HttpStatus.OK).json(room);
	}
}
