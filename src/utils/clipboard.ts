/**
 * Clipboard utilities — OSC 52 escape sequence + native platform commands.
 * Modeled after opencode's clipboard implementation.
 */

/** Write to clipboard via OSC 52 escape sequence (works over SSH/tmux) */
function writeOsc52(text: string): void {
	if (!process.stdout.isTTY) return;
	const base64 = Buffer.from(text).toString("base64");
	const osc52 = `\x1b]52;c;${base64}\x07`;
	const passthrough = process.env["TMUX"] || process.env["STY"];
	const sequence = passthrough ? `\x1bPtmux;\x1b${osc52}\x1b\\` : osc52;
	process.stdout.write(sequence);
}

type CopyMethod = (text: string) => Promise<void>;

let resolvedMethod: CopyMethod | null = null;

function getCopyMethod(): CopyMethod {
	if (resolvedMethod) return resolvedMethod;

	const platform = process.platform;

	if (platform === "darwin") {
		resolvedMethod = async (text) => {
			const escaped = text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
			const proc = Bun.spawn([
				"osascript",
				"-e",
				`set the clipboard to "${escaped}"`,
			]);
			await proc.exited;
		};
	} else if (platform === "win32") {
		resolvedMethod = async (text) => {
			const proc = Bun.spawn(["powershell.exe", "-Command", "Set-Clipboard"], {
				stdin: "pipe",
			});
			proc.stdin.write(text);
			proc.stdin.end();
			await proc.exited;
		};
	} else {
		// Linux — try wl-copy (Wayland), then xclip, then xsel
		const session = process.env["XDG_SESSION_TYPE"];
		if (session === "wayland") {
			resolvedMethod = async (text) => {
				const proc = Bun.spawn(["wl-copy"], { stdin: "pipe" });
				proc.stdin.write(text);
				proc.stdin.end();
				await proc.exited;
			};
		} else {
			resolvedMethod = async (text) => {
				try {
					const proc = Bun.spawn(["xclip", "-selection", "clipboard"], {
						stdin: "pipe",
					});
					proc.stdin.write(text);
					proc.stdin.end();
					await proc.exited;
				} catch {
					const proc = Bun.spawn(["xsel", "--clipboard", "--input"], {
						stdin: "pipe",
					});
					proc.stdin.write(text);
					proc.stdin.end();
					await proc.exited;
				}
			};
		}
	}

	return resolvedMethod;
}

/** Copy text to clipboard using both OSC 52 and native platform method */
export async function copy(text: string): Promise<void> {
	writeOsc52(text);
	await getCopyMethod()(text);
}
