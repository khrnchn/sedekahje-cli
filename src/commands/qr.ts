import { Command } from "commander";
import chalk from "chalk";
import { searchInstitutions } from "../api.ts";
import { renderQrCode } from "../utils/qr.ts";

export const qrCommand = new Command("qr")
	.description("Display QR code for an institution")
	.argument("<name>", "Institution name to search for")
	.action(async (name: string) => {
		try {
			const data = await searchInstitutions({ search: name, limit: 5 });

			if (data.institutions.length === 0) {
				console.error(chalk.yellow(`No institutions found matching "${name}"`));
				process.exit(1);
			}

			const inst = data.institutions[0]!;
			const payment = inst.supportedPayment?.[0];
			const paymentLabel: Record<string, string> = {
				duitnow: "DuitNow",
				tng: "Touch 'n Go",
				boost: "Boost",
				toyyibpay: "ToyyibPay",
			};
			const paymentHex: Record<string, string> = {
				duitnow: "#ED2C67",
				tng: "#015ABF",
				boost: "#FF3333",
				toyyibpay: "#00847F",
			};

			console.log(`\n  ${chalk.bold(inst.name)} ${chalk.dim(`(${inst.state})`)}`);
			if (payment) {
				const color = paymentHex[payment] ?? "#888";
				const label = paymentLabel[payment] ?? payment;
				console.log(`  ${chalk.hex(color)(`── ${label} ──────────`)}`);
			}
			console.log("");

			if (inst.qrContent) {
				await renderQrCode(inst.qrContent);
				if (payment) {
					console.log(chalk.dim(`  Scan with ${paymentLabel[payment] ?? payment}`));
				}
			} else if (inst.qrImage) {
				console.log(chalk.dim("  No QR data available. QR image URL:"));
				console.log(`  ${chalk.underline(inst.qrImage)}\n`);
			} else {
				console.log(chalk.yellow("  No QR code available for this institution.\n"));
			}

			if (data.institutions.length > 1) {
				console.log(chalk.dim(`  Showing first match. Other matches:`));
				for (const other of data.institutions.slice(1)) {
					console.log(chalk.dim(`    - ${other.name} (${other.state})`));
				}
				console.log("");
			}
			console.log(chalk.dim("  buymeacoffee.com/") + chalk.hex("#FED321")("khairin"));
			console.log("");
		} catch (err) {
			console.error(chalk.red(`Error: ${(err as Error).message}`));
			process.exit(1);
		}
	});
