import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./config/environment-variables";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix("api");

	const port = app.get(ConfigService<EnvironmentVariables>).get("PORT");
	await app.listen(port);
}
bootstrap();
