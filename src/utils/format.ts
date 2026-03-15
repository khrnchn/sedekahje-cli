import chalk from "chalk";
import type {
	Category,
	Institution,
	InstitutionCompact,
	Pagination,
	PaymentMethod,
} from "../types.ts";

const BMC_LINE = chalk.dim("  buymeacoffee.com/") + chalk.hex("#FED321")("khairin");

const CATEGORY_COLORS: Record<Category, (s: string) => string> = {
	masjid: chalk.blue,
	surau: chalk.green,
	tahfiz: chalk.yellow,
	kebajikan: chalk.magenta,
	"lain-lain": chalk.gray,
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
	duitnow: "DuitNow",
	tng: "TnG",
	boost: "Boost",
	toyyibpay: "ToyyibPay",
};

function categoryBadge(cat: Category): string {
	const colorFn = CATEGORY_COLORS[cat] ?? chalk.white;
	return colorFn(`[${cat}]`);
}

function formatPayments(methods: PaymentMethod[] | null): string {
	if (!methods || methods.length === 0) return chalk.dim("—");
	return methods
		.map((m) => PAYMENT_LABELS[m] ?? m)
		.join(chalk.dim(", "));
}

function truncate(str: string, max: number): string {
	return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

function padEnd(str: string, len: number): string {
	// chalk adds ANSI codes, so we need visible length
	const visible = str.replace(/\x1b\[[0-9;]*m/g, "");
	const padding = Math.max(0, len - visible.length);
	return str + " ".repeat(padding);
}

export function formatInstitutionRow(inst: Institution | InstitutionCompact): string {
	const name = truncate(inst.name, 32);
	const cat = categoryBadge(inst.category);
	const state = chalk.cyan(truncate(inst.state, 20));
	const city = chalk.dim(truncate(inst.city, 16));
	const payment = formatPayments(inst.supportedPayment);

	return `  ${padEnd(name, 34)} ${padEnd(cat, 22)} ${padEnd(state, 28)} ${padEnd(city, 18)} ${payment}`;
}

function headerRow(): string {
	const h = chalk.bold;
	return `  ${padEnd(h("Name"), 34)} ${padEnd(h("Category"), 22)} ${padEnd(h("State"), 28)} ${padEnd(h("City"), 18)} ${h("Payment")}`;
}

function separator(): string {
	return chalk.dim("  " + "─".repeat(110));
}

export function formatInstitutionTable(
	institutions: (Institution | InstitutionCompact)[],
	pagination?: Pagination,
): string {
	const lines: string[] = [];
	lines.push("");
	lines.push(headerRow());
	lines.push(separator());

	if (institutions.length === 0) {
		lines.push(chalk.dim("  No institutions found."));
	} else {
		for (const inst of institutions) {
			lines.push(formatInstitutionRow(inst));
		}
	}

	if (pagination) {
		lines.push(separator());
		lines.push(
			chalk.dim(
				`  Page ${pagination.page}/${pagination.totalPages} · ${pagination.total} total results`,
			),
		);
		if (pagination.hasMore) {
			lines.push(chalk.dim(`  Use --page ${pagination.page + 1} for next page`));
		}
	}

	lines.push(BMC_LINE);
	lines.push("");
	return lines.join("\n");
}

export function formatInstitutionDetail(inst: Institution | InstitutionCompact): string {
	const lines: string[] = [];
	lines.push("");
	lines.push(`  ${chalk.bold(inst.name)}`);
	lines.push(chalk.dim("  " + "─".repeat(40)));
	lines.push(`  ${chalk.dim("Category:")}  ${categoryBadge(inst.category)}`);
	lines.push(`  ${chalk.dim("State:")}     ${chalk.cyan(inst.state)}`);
	lines.push(`  ${chalk.dim("City:")}      ${inst.city}`);
	lines.push(`  ${chalk.dim("Payment:")}   ${formatPayments(inst.supportedPayment)}`);

	if ("slug" in inst && inst.slug) {
		lines.push(`  ${chalk.dim("URL:")}       ${chalk.underline(`https://sedekah.je/${inst.category}/${inst.slug}`)}`);
	}

	if (inst.qrContent) {
		lines.push(`  ${chalk.dim("QR Data:")}   ${chalk.dim("available (use 'sedekah qr' to display)")}`);
	} else if (inst.qrImage) {
		lines.push(`  ${chalk.dim("QR Image:")}  ${chalk.underline(inst.qrImage)}`);
	}

	lines.push(BMC_LINE);
	lines.push("");
	return lines.join("\n");
}
