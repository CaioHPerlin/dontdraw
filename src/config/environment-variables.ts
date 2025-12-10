import { plainToInstance } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Max, Min, validateSync } from "class-validator";

export class EnvironmentVariables {
	@IsString()
	@IsNotEmpty()
	DATABASE_URL: string;

	@IsInt()
	@Min(1)
	@Max(65535)
	PORT: number;
}

export function validateEnvironmentVariables(
	config: Record<string, unknown>,
): EnvironmentVariables {
	const transformed = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
		exposeDefaultValues: true,
	});

	const validationErrors = validateSync(transformed, {
		skipMissingProperties: false,
		forbidUnknownValues: false,
		whitelist: true,
	});

	if (validationErrors.length > 0) {
		throw new Error(validationErrors.toString());
	}

	return transformed;
}
