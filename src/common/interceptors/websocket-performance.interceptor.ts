import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { EnvironmentVariables } from "src/config/environment-variables";

interface EventMetrics {
	count: number;
	totalTime: number;
}

@Injectable()
export class WebSocketPerformanceInterceptor implements NestInterceptor {
	private static metrics = new Map<string, EventMetrics>();
	private static totalEvents = 0;
	private static readonly LOG_INTERVAL = 50;
	private readonly debugEnabled: boolean;

	constructor(private readonly configService: ConfigService<EnvironmentVariables>) {
		this.debugEnabled = this.configService.get("PERFORMANCE_WS") ?? false;
	}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		if (!this.debugEnabled) {
			return next.handle();
		}
		const handlerName = context.getHandler().name;
		const now = Date.now();

		return next.handle().pipe(
			tap(() => {
				const executionTime = Date.now() - now;
				this.updateMetrics(handlerName, executionTime);
			}),
		);
	}

	private updateMetrics(eventName: string, executionTime: number): void {
		const existing = WebSocketPerformanceInterceptor.metrics.get(eventName);
		if (existing) {
			existing.count++;
			existing.totalTime += executionTime;
		} else {
			WebSocketPerformanceInterceptor.metrics.set(eventName, {
				count: 1,
				totalTime: executionTime,
			});
		}

		WebSocketPerformanceInterceptor.totalEvents++;
		if (
			WebSocketPerformanceInterceptor.totalEvents %
				WebSocketPerformanceInterceptor.LOG_INTERVAL ===
			0
		) {
			this.logMetrics();
		}
	}

	private logMetrics(): void {
		console.log(
			`\n⚙️  WebSocket Performance @ ${WebSocketPerformanceInterceptor.totalEvents}ev`,
		);
		console.log("─".repeat(60));

		WebSocketPerformanceInterceptor.metrics.forEach((metrics, eventName) => {
			const avgTime = (metrics.totalTime / metrics.count).toFixed(2);
			console.log(
				`${eventName}: ${metrics.count} calls | avg ${avgTime}ms | total ${metrics.totalTime}ms`,
			);
		});

		console.log("─".repeat(60));
	}

	static getMetrics(): Map<string, EventMetrics> {
		return this.metrics;
	}

	static resetMetrics(): void {
		this.metrics.clear();
		this.totalEvents = 0;
	}
}
