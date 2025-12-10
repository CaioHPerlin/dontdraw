import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";

const coreModules = [ConfigModule];

@Module({
	imports: [...coreModules],
})
export class AppModule {}
