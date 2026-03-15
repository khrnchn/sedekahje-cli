/**
 * Selection → clipboard bridge utility.
 * Gets selected text from the renderer, copies it, shows a toast.
 */
import type { CliRenderer } from "@opentui/core";
import * as Clipboard from "./clipboard.ts";

interface Toast {
	show: (opts: {
		variant?: "info" | "success" | "warning" | "error";
		message: string;
	}) => void;
	error: (err: unknown) => void;
}

export function copySelection(renderer: CliRenderer, toast: Toast): boolean {
	const text = renderer.getSelection()?.getSelectedText();
	if (!text) return false;

	Clipboard.copy(text)
		.then(() =>
			toast.show({ message: "Copied to clipboard", variant: "info" }),
		)
		.catch(toast.error);

	renderer.clearSelection();
	return true;
}
