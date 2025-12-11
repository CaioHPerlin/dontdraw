import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { RoomsModule } from "./rooms/rooms.module";
import { ServeStaticModule } from "./serve-static/serve-static.module";
import { AuthModule } from "./auth/auth.module";

@Module({
	imports: [ConfigModule, ServeStaticModule, RoomsModule, AuthModule],
})
export class AppModule {}
