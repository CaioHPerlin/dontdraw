import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage("joinRoom")
	handleJoinRoom(@MessageBody("slug") slug: string, @ConnectedSocket() client: Socket) {
		console.log(`Client ${client.id} joined room: ${slug}`);
	}
}
