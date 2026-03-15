import { Command } from "commander";
import chalk from "chalk";
import { searchInstitutions } from "../api.ts";
import { formatInstitutionTable } from "../utils/format.ts";

export const searchCommand = new Command("search")
	.description("Search for institutions")
	.argument("[query]", "Search query (name, description, or city)")
	.option("-s, --state <state>", "Filter by state")
	.option("-c, --category <category>", "Filter by category (masjid,surau,tahfiz,kebajikan,lain-lain)")
	.option("-p, --page <number>", "Page number", "1")
	.option("-l, --limit <number>", "Results per page (max 50)", "40")
	.option("--json", "Output raw JSON")
	.action(async (query: string | undefined, opts) => {
		try {
			const data = await searchInstitutions({
				search: query,
				state: opts.state,
				category: opts.category,
				page: Number.parseInt(opts.page, 10),
				limit: Number.parseInt(opts.limit, 10),
			});

			if (opts.json) {
				console.log(JSON.stringify(data, null, 2));
				return;
			}

			console.log(formatInstitutionTable(data.institutions, data.pagination));
		} catch (err) {
			console.error(chalk.red(`Error: ${(err as Error).message}`));
			process.exit(1);
		}
	});
