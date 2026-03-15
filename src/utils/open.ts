import { existsSync } from "fs";
import { readFileSync } from "fs";

/** Detect if running under WSL (Windows Subsystem for Linux) */
function isWsl(): boolean {
	try {
		if (existsSync("/proc/version")) {
			const content = readFileSync("/proc/version", "utf-8");
			return content.toLowerCase().includes("microsoft");
		}
	} catch {
		// ignore
	}
	return false;
}

/**
 * Open a URL in the system's default browser.
 * Cross-platform: macOS (open), Windows (cmd /c start), Linux (xdg-open).
 * WSL: uses wslview or falls back to cmd.exe.
 */
export function openUrl(url: string): void {
	const platform = process.platform;

	if (platform === "darwin") {
		Bun.spawn(["open", url]);
		return;
	}

	if (platform === "win32") {
		Bun.spawn(["cmd", "/c", "start", "", url]);
		return;
	}

	if (isWsl()) {
		try {
			Bun.spawn(["wslview", url]);
			return;
		} catch {
			// Fallback: use cmd.exe via wsl
			Bun.spawn(["cmd.exe", "/c", "start", "", url]);
			return;
		}
	}

	// Linux
	Bun.spawn(["xdg-open", url]);
}
