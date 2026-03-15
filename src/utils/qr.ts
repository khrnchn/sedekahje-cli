import qrcode from "qrcode-terminal";

// Fixed frame size — large enough for the biggest QR codes (~200 char payloads)
// QR version 10 (small mode) renders at ~29 lines x ~57 cols
// We use a consistent frame so all QR codes occupy the same space
const FRAME_WIDTH = 57;
const FRAME_HEIGHT = 29;

/** Generate QR string and pad/center it to a fixed frame size */
export function generateQrString(data: string): Promise<string> {
	return new Promise((resolve) => {
		qrcode.generate(data, { small: true }, (code: string) => {
			const raw = code ?? "";
			const lines = raw.split("\n").filter((l) => l.length > 0);

			const qrWidth = Math.max(...lines.map((l) => l.length));
			const qrHeight = lines.length;

			// Vertical centering
			const topPad = Math.max(0, Math.floor((FRAME_HEIGHT - qrHeight) / 2));
			const bottomPad = Math.max(0, FRAME_HEIGHT - qrHeight - topPad);

			// Horizontal centering
			const leftPad = Math.max(0, Math.floor((FRAME_WIDTH - qrWidth) / 2));

			const padded: string[] = [];

			for (let i = 0; i < topPad; i++) {
				padded.push(" ".repeat(FRAME_WIDTH));
			}

			for (const line of lines) {
				const padRight = Math.max(0, FRAME_WIDTH - leftPad - line.length);
				padded.push(
					" ".repeat(leftPad) + line + " ".repeat(padRight),
				);
			}

			for (let i = 0; i < bottomPad; i++) {
				padded.push(" ".repeat(FRAME_WIDTH));
			}

			resolve(padded.join("\n"));
		});
	});
}

/** Render QR code to stdout (CLI usage) with consistent framing */
export async function renderQrCode(data: string): Promise<void> {
	const framed = await generateQrString(data);
	console.log(framed);
}
