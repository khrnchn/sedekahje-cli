import type { Institution, InstitutionCompact } from "../types.ts";
import { QrDisplay } from "./QrDisplay.tsx";

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
				borderColor={focused ? "#3b82f6" : "#334155"}
				title=" Detail "
				padding={1}
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				<text fg="#64748b">{"Select an institution to view details"}</text>
			</box>
		);
	}

	const catColor = CATEGORY_COLORS[inst.category ?? ""] ?? "#6b7280";
	const payments = inst.supportedPayment
		?.map((p) => PAYMENT_LABELS[p] ?? p)
		.join(", ") ?? "—";

	const url =
		"slug" in inst && inst.slug
			? `https://sedekah.je/${inst.category}/${inst.slug}`
			: null;

	return (
		<box
			flexGrow={1}
			border={true}
			borderStyle="rounded"
			borderColor={focused ? "#3b82f6" : "#334155"}
			title=" Detail "
			padding={1}
			flexDirection="column"
		>
			<text>
				<b fg="#f8fafc">{inst.name ?? "Unknown"}</b>
			</text>

			<box height={1} />

			<text>
				<span fg="#94a3b8">{"Category:  "}</span>
				<span fg={catColor}>{inst.category ?? "—"}</span>
			</text>
			<text>
				<span fg="#94a3b8">{"State:     "}</span>
				<span fg="#e2e8f0">{inst.state ?? "—"}</span>
			</text>
			<text>
				<span fg="#94a3b8">{"City:      "}</span>
				<span fg="#e2e8f0">{inst.city ?? "—"}</span>
			</text>
			<text>
				<span fg="#94a3b8">{"Payment:   "}</span>
				<span fg="#22d3ee">{payments}</span>
			</text>

			{url ? (
				<text>
					<span fg="#94a3b8">{"URL:       "}</span>
					<u>
						<span fg="#60a5fa">{url}</span>
					</u>
				</text>
			) : null}

			{"description" in inst && inst.description ? (
				<>
					<box height={1} />
					<text fg="#94a3b8">{inst.description}</text>
				</>
			) : null}

			<box height={1} />
			<QrDisplay data={inst.qrContent} />
		</box>
	);
}
