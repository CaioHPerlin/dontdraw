import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { RoomsController } from "./rooms.controller";

@Module({
	imports: [PrismaModule],
	providers: [RoomsService],
	controllers: [RoomsController],
})
export class RoomsModule {}
