import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class WsJwtGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const client: Socket = context.switchToWs().getClient();
		const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(" ")[1];

		if (!token) {
			throw new WsException("Unauthorized");
		}

		try {
			const payload = this.jwtService.verify(token);
			client.data.user = { userId: payload.sub, email: payload.email };
			return true;
		} catch (error) {
			throw new WsException("Unauthorized");
		}
	}
}
