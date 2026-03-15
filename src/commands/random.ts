import { Command } from "commander";
import chalk from "chalk";
import { getRandomInstitution } from "../api.ts";
import { formatInstitutionDetail } from "../utils/format.ts";

export const randomCommand = new Command("random")
	.description("Show a random institution")
	.option("--json", "Output raw JSON")
	.action(async (opts) => {
		try {
			const inst = await getRandomInstitution();

			if (opts.json) {
				console.log(JSON.stringify(inst, null, 2));
				return;
			}

			console.log(formatInstitutionDetail(inst));
		} catch (err) {
			console.error(chalk.red(`Error: ${(err as Error).message}`));
			process.exit(1);
		}
	});
