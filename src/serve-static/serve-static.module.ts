import { Module } from "@nestjs/common";
import { ServeStaticModule as NestServeStaticModule } from "@nestjs/serve-static";
import { join } from "node:path";

@Module({
	imports: [
		NestServeStaticModule.forRoot({
			rootPath: join(__dirname, "../../../client"),
			exclude: ["/api/*path"],
		}),
	],
})
export class ServeStaticModule {}
