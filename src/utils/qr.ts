import qrcode from "qrcode-terminal";

// Default frame size — large enough for the biggest QR codes (~200 char payloads)
// QR version 10 (small mode) renders at ~29 lines x ~57 cols
const DEFAULT_FRAME_WIDTH = 57;
const DEFAULT_FRAME_HEIGHT = 29;

export interface QrFrameOptions {
	frameWidth?: number;
	frameHeight?: number;
}

/** Generate QR string and pad/center it to a frame size */
export function generateQrString(
	data: string,
	options?: QrFrameOptions,
): Promise<string> {
	const frameWidth = options?.frameWidth ?? DEFAULT_FRAME_WIDTH;
	const frameHeight = options?.frameHeight ?? DEFAULT_FRAME_HEIGHT;

	return new Promise((resolve) => {
		qrcode.generate(data, { small: true }, (code: string) => {
			const raw = code ?? "";
			const lines = raw.split("\n").filter((l) => l.length > 0);

			const qrWidth = Math.max(...lines.map((l) => l.length));
			const qrHeight = lines.length;

			// Vertical centering
			const topPad = Math.max(0, Math.floor((frameHeight - qrHeight) / 2));
			const bottomPad = Math.max(0, frameHeight - qrHeight - topPad);

			// Horizontal centering
			const leftPad = Math.max(0, Math.floor((frameWidth - qrWidth) / 2));

			const padded: string[] = [];

			for (let i = 0; i < topPad; i++) {
				padded.push(" ".repeat(frameWidth));
			}

			for (const line of lines) {
				const padRight = Math.max(0, frameWidth - leftPad - line.length);
				padded.push(
					" ".repeat(leftPad) + line + " ".repeat(padRight),
				);
			}

			for (let i = 0; i < bottomPad; i++) {
				padded.push(" ".repeat(frameWidth));
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
