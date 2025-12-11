import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { RoomsService } from "./rooms.service";

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
		console.log(`Client ${client.id} attempting to join room: ${slug}`);
		await this.roomsService.findOrCreateRoomBySlug(slug);
	}
}
