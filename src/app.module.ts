import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { ServeStaticModule } from "./serve-static/serve-static.module";
import { AuthModule } from "./auth/auth.module";
import { RoomsModule } from "./rooms/rooms.module";

@Module({
	imports: [ConfigModule, ServeStaticModule, AuthModule, RoomsModule],
})
export class AppModule {}
