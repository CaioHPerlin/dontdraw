import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
} from "@nestjs/websockets";
import { UseInterceptors } from "@nestjs/common";
import { Socket } from "socket.io";
import { RoomsService } from "./rooms.service";
import type { Stroke } from "./dto/stroke.dto";
import { WebSocketLoggingInterceptor } from "src/common/interceptors/websocket-logging.interceptor";

@UseInterceptors(WebSocketLoggingInterceptor)
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
		@MessageBody("slug") slug: string,
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
}
