import { useKeyboard } from "@opentui/react";
import type { Institution, InstitutionCompact } from "../types.ts";
import { Spinner } from "./Spinner.tsx";

interface InstitutionListProps {
	institutions: (Institution | InstitutionCompact)[];
	loading: boolean;
	focused: boolean;
	selectedIndex: number;
	onSelect: (index: number) => void;
	width?: number;
	height?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
	masjid: "#3b82f6",
	mosque: "#3b82f6",
	surau: "#22c55e",
	tahfiz: "#eab308",
	kebajikan: "#a855f7",
	"lain-lain": "#6b7280",
};

export function InstitutionList({
	institutions,
	loading,
	focused,
	selectedIndex,
	onSelect,
	width = 42,
	height,
}: InstitutionListProps) {
	useKeyboard(
		(key) => {
			if (!focused) return;

			if (key.name === "j" || key.name === "down") {
				onSelect(Math.min(selectedIndex + 1, institutions.length - 1));
			} else if (key.name === "k" || key.name === "up") {
				onSelect(Math.max(selectedIndex - 1, 0));
			} else if (key.name === "g") {
				onSelect(0);
			} else if (key.name === "G") {
				onSelect(institutions.length - 1);
			}
		},
	);

	if (loading) {
		return (
			<box
				width={width}
				border={true}
				borderStyle="rounded"
				borderColor="#334155"
				title=" Institutions "
				padding={1}
				flexDirection="column"
			>
				<Spinner />
			</box>
		);
	}

	if (institutions.length === 0) {
		return (
			<box
				width={width}
				border={true}
				borderStyle="rounded"
				borderColor={focused ? "#01AB95" : "#334155"}
				title=" Institutions "
				padding={1}
				flexDirection="column"
			>
				<text fg="#64748b">{"No institutions found"}</text>
			</box>
		);
	}

		return (
		<box
			width={width}
			height={height}
			border={true}
			borderStyle="rounded"
			borderColor={focused ? "#01AB95" : "#334155"}
			title=" Institutions "
			flexDirection="column"
		>
			<scrollbox
			focused={focused}
			height={height != null ? Math.max(5, height - 2) : undefined}
			flexGrow={1}
			flexShrink={1}
			minHeight={0}
			scrollbarOptions={{
				trackOptions: {
					backgroundColor: "#334155",
					foregroundColor: "#01CDB4",
				},
			}}
		>
				{institutions.map((inst, i) => {
					const isSelected = i === selectedIndex;
					const catColor = CATEGORY_COLORS[inst.category] ?? "#6b7280";

					return (
						<box
							key={inst.id}
							height={2}
							width="100%"
							backgroundColor={isSelected ? "#1e3a5f" : "transparent"}
							paddingLeft={1}
							paddingRight={1}
							onMouseUp={() => onSelect(i)}
						>
							<box flexDirection="column" flexGrow={1}>
								<text>
									{isSelected ? (
										<span fg="#f8fafc">{`> ${inst.name ?? "Unknown"}`}</span>
									) : (
										<span fg="#cbd5e1">{`  ${inst.name ?? "Unknown"}`}</span>
									)}
								</text>
								<text>
									<span fg={catColor}>{`  [${inst.category ?? "—"}]`}</span>
									<span fg="#64748b">{` ${inst.state ?? ""}`}</span>
								</text>
							</box>
						</box>
					);
				})}
			</scrollbox>
		</box>
	);
}
