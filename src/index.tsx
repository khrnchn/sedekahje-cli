#!/usr/bin/env bun
import { Command } from "commander";
import { searchCommand } from "./commands/search.ts";
import { randomCommand } from "./commands/random.ts";
import { qrCommand } from "./commands/qr.ts";
import { browseCommand, launchBrowse } from "./commands/browse.tsx";

const program = new Command()
	.name("sedekahje")
	.description("CLI for sedekah.je — browse Malaysian donation QR codes")
	.version("0.1.0");

program.addCommand(searchCommand);
program.addCommand(randomCommand);
program.addCommand(qrCommand);
program.addCommand(browseCommand);

program.action(() => launchBrowse());

program.parse();
