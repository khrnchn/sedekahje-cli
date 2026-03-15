import { useState, useEffect } from "react";
import type { PaymentMethod } from "../types.ts";
import { paymentColors, paymentLabels, colors } from "./brand.ts";
import { generateQrString } from "../utils/qr.ts";

interface QrDisplayProps {
	data: string | null;
	paymentMethod?: PaymentMethod | null;
	frameWidth?: number;
	frameHeight?: number;
}

export function QrDisplay({
	data,
	paymentMethod,
	frameWidth,
	frameHeight,
}: QrDisplayProps) {
	const [qrText, setQrText] = useState<string>("");

	useEffect(() => {
		if (!data) {
			setQrText("");
			return;
		}
		generateQrString(data, { frameWidth, frameHeight }).then((framed) =>
			setQrText(framed),
		);
	}, [data, frameWidth, frameHeight]);

	if (!data || !qrText) {
		return (
			<box paddingLeft={1}>
				<text fg={colors.textMuted}>{"No QR code available"}</text>
			</box>
		);
	}

	const labelColor =
		(paymentMethod && paymentColors[paymentMethod]) || colors.textDim;
	const label = paymentMethod && paymentLabels[paymentMethod];

	return (
		<box flexDirection="column">
			{/* Payment label blended above QR */}
			{label ? (
				<text>
					<span fg={labelColor}>{`  ── ${label} `}</span>
					<span fg={colors.textMuted}>{"──────────"}</span>
				</text>
			) : null}

			{/* QR code in fixed frame */}
			<text fg={colors.text}>{qrText}</text>

			{/* Bottom line echoing payment */}
			{label ? (
				<text fg={colors.textMuted}>
					{`  Scan with ${label}`}
				</text>
			) : null}
		</box>
	);
}
