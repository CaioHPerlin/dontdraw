import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { RoomsGateway } from "./rooms.gateway";
import { AuthModule } from "src/auth/auth.module";

@Module({
	imports: [PrismaModule, AuthModule],
	providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}
