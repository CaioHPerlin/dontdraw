import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { User } from "src/prisma/generated/client";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@UseGuards(LocalAuthGuard)
	@Post("login")
	async login(@Request() req: Request & { user: User }, @Body() _dto: LoginDto) {
		return this.authService.loginWithUser(req.user);
	}
}
