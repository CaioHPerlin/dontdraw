import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class WebSocketLoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const handlerName = context.getHandler().name;
		const now = Date.now();

		console.log(this.buildLog(new Date().toISOString(), handlerName, "Started"));

		return next.handle().pipe(
			tap(() => {
				const responseTime = Date.now() - now;
				console.log(
					this.buildLog(
						new Date().toISOString(),
						handlerName,
						`Completed in ${responseTime}ms`,
					),
				);
			}),
		);
	}

	private buildLog(dateString: string, handlerName: string, message: string): string {
		return `[${dateString}] WebSocket:${handlerName} - ${message}`;
	}
}
