import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { RoomsModule } from "./rooms/rooms.module";

@Module({
	imports: [ConfigModule, RoomsModule],
})
export class AppModule {}
