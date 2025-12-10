import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsString, validateSync } from "class-validator";

class EnvironmentVariables {
	@IsString()
	@IsNotEmpty()
	DATABASE_URL: string;
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
