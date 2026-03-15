import type { Institution, InstitutionCompact } from "../types.ts";
import { QrDisplay } from "./QrDisplay.tsx";
import { colors, MOSQUE_ART } from "./brand.ts";

interface InstitutionDetailProps {
	institution: Institution | InstitutionCompact | null;
	focused: boolean;
}

const PAYMENT_LABELS: Record<string, string> = {
	duitnow: "DuitNow",
	tng: "Touch 'n Go",
	boost: "Boost",
	toyyibpay: "ToyyibPay",
};

const CATEGORY_COLORS: Record<string, string> = {
	masjid: "#3b82f6",
	mosque: "#3b82f6",
	surau: "#22c55e",
	tahfiz: "#eab308",
	kebajikan: "#a855f7",
	"lain-lain": "#6b7280",
};

export function InstitutionDetail({
	institution: inst,
	focused,
}: InstitutionDetailProps) {
	if (!inst) {
		return (
			<box
				flexGrow={1}
				border={true}
				borderStyle="rounded"
				borderColor={focused ? colors.borderFocused : colors.border}
				title=" Detail "
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				{/* Mosque ASCII art as empty state */}
				<scrollbox>
					{MOSQUE_ART.map((line, i) => (
						<text key={i} fg={colors.tealDark}>
							{line}
						</text>
					))}
				</scrollbox>
				<box height={1} />
				<text fg={colors.tealLight}>
					{"  Select an institution to view details"}
				</text>
			</box>
		);
	}

	const catColor = CATEGORY_COLORS[inst.category ?? ""] ?? "#6b7280";
	const payments =
		inst.supportedPayment?.map((p) => PAYMENT_LABELS[p] ?? p).join(", ") ??
		"—";
	const primaryPayment = inst.supportedPayment?.[0] ?? null;

	const url =
		"slug" in inst && inst.slug
			? `https://sedekah.je/${inst.category}/${inst.slug}`
			: null;

	return (
		<box
			flexGrow={1}
			border={true}
			borderStyle="rounded"
			borderColor={focused ? colors.borderFocused : colors.border}
			title=" Detail "
			padding={1}
			flexDirection="column"
		>
			<text>
				<b fg={colors.text}>{inst.name ?? "Unknown"}</b>
			</text>

			<box height={1} />

			<text>
				<span fg={colors.textDim}>{"Category:  "}</span>
				<span fg={catColor}>{inst.category ?? "—"}</span>
			</text>
			<text>
				<span fg={colors.textDim}>{"State:     "}</span>
				<span fg={colors.text}>{inst.state ?? "—"}</span>
			</text>
			<text>
				<span fg={colors.textDim}>{"City:      "}</span>
				<span fg={colors.text}>{inst.city ?? "—"}</span>
			</text>
			<text>
				<span fg={colors.textDim}>{"Payment:   "}</span>
				<span fg="#22d3ee">{payments}</span>
			</text>

			{url ? (
				<text>
					<span fg={colors.textDim}>{"URL:       "}</span>
					<u>
						<span fg="#60a5fa">{url}</span>
					</u>
				</text>
			) : null}

			{"description" in inst && inst.description ? (
				<>
					<box height={1} />
					<text fg={colors.textDim}>{inst.description}</text>
				</>
			) : null}

			<box height={1} />
			<QrDisplay data={inst.qrContent} paymentMethod={primaryPayment} />
		</box>
	);
}
