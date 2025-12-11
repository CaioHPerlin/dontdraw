import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
} from "@nestjs/websockets";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { Socket } from "socket.io";
import { RoomsService } from "./rooms.service";
import type { Stroke } from "./dto/stroke.dto";
import { WebSocketPerformanceInterceptor } from "src/common/interceptors/websocket-performance.interceptor";
import { WsJwtGuard } from "src/auth/guards/ws-jwt.guard";
import { NormalizeSlugPipe } from "src/common/pipes/normalize-slug.pipe";

@UseGuards(WsJwtGuard)
@UseInterceptors(WebSocketPerformanceInterceptor)
@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly roomsService: RoomsService) {}

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage("joinRoom")
	async handleJoinRoom(
		@MessageBody("slug", new NormalizeSlugPipe()) slug: string,
		@ConnectedSocket() client: Socket,
	) {
		const { room } = await this.roomsService.findOrCreateRoomBySlug(slug);
		client.join(slug);

		return { event: "joinedRoom", data: room };
	}

	@SubscribeMessage("draw")
	async handleDraw(@MessageBody() data: Stroke, @ConnectedSocket() client: Socket) {
		client.to(data.slug).emit("draw", data);
		this.roomsService.saveStrokeToRoom(data.slug, data);
	}

	@SubscribeMessage("clearCanvas")
	async handleClearCanvas(
		@MessageBody("slug", new NormalizeSlugPipe()) slug: string,
		@ConnectedSocket() client: Socket,
	) {
		client.to(slug).emit("clearCanvas");
		this.roomsService.clearStrokesInRoom(slug);
	}
}
