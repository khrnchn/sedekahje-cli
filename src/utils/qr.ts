import qrcode from "qrcode-terminal";

export function renderQrCode(data: string): Promise<void> {
	return new Promise((resolve) => {
		qrcode.generate(data, { small: true }, (code: string) => {
			console.log(code);
			resolve();
		});
	});
}
