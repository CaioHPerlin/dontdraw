import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class NormalizeSlugPipe implements PipeTransform<string, string> {
	transform(value: string): string {
		if (typeof value !== "string") return value as any;
		const normalized = value.trim().toLowerCase().replace(/\s+/g, "-");
		return normalized;
	}
}
