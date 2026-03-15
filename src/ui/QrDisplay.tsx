import { useState, useEffect } from "react";
import qrcode from "qrcode-terminal";

interface QrDisplayProps {
	data: string | null;
}

export function QrDisplay({ data }: QrDisplayProps) {
	const [qrText, setQrText] = useState<string>("");

	useEffect(() => {
		if (!data) {
			setQrText("");
			return;
		}
		qrcode.generate(data, { small: true }, (code: string) => {
			setQrText(code ?? "");
		});
	}, [data]);

	if (!data || !qrText) {
		return (
			<box padding={1}>
				<text fg="#64748b">{"No QR code available"}</text>
			</box>
		);
	}

	return (
		<box flexDirection="column" padding={1}>
			<text fg="#e2e8f0">{qrText}</text>
		</box>
	);
}
