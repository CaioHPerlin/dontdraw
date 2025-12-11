import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { RoomsController } from "./rooms.controller";
import { RoomsGateway } from "./rooms.gateway";

@Module({
	imports: [PrismaModule],
	providers: [RoomsService, RoomsGateway],
	controllers: [RoomsController],
})
export class RoomsModule {}
