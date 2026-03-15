import { Command } from "commander";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App } from "../ui/App.tsx";
import { ErrorBoundary } from "../ui/ErrorBoundary.tsx";
import { ToastProvider } from "../ui/Toast.tsx";
import { DialogProvider } from "../ui/Dialog.tsx";

export const browseCommand = new Command("browse")
	.description("Launch interactive TUI browser")
	.option("-s, --state <state>", "Pre-filter by state")
	.option("-c, --category <category>", "Pre-filter by category")
	.action(async (opts) => {
		const renderer = await createCliRenderer({ exitOnCtrlC: false });
		createRoot(renderer).render(
			// @ts-expect-error - ErrorBoundary class component type mismatch with @opentui JSX
			<ErrorBoundary>
				<ToastProvider>
					<DialogProvider>
						<App initialState={opts.state} initialCategory={opts.category} />
					</DialogProvider>
				</ToastProvider>
			</ErrorBoundary>,
		);
	});
