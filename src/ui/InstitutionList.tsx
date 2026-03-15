import { useState, useEffect } from "react";
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

	// Manual windowing: each item is 2 rows tall
	const ITEM_HEIGHT = 2;
	const viewportRows = height != null ? Math.max(4, height - 2) : institutions.length * ITEM_HEIGHT;
	const visibleCount = Math.floor(viewportRows / ITEM_HEIGHT);

	// Track scroll offset, keeping selectedIndex in view
	const [scrollOffset, setScrollOffset] = useState(0);
	useEffect(() => {
		setScrollOffset((prev) => {
			if (selectedIndex < prev) return selectedIndex;
			if (selectedIndex >= prev + visibleCount) return selectedIndex - visibleCount + 1;
			return prev;
		});
	}, [selectedIndex, visibleCount]);

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

	const startIdx = Math.max(0, Math.min(scrollOffset, institutions.length - visibleCount));
	const endIdx = Math.min(institutions.length, startIdx + visibleCount);
	const visibleInstitutions = institutions.slice(startIdx, endIdx);

	// Scrollbar indicator
	const totalItems = institutions.length;
	const showScrollbar = totalItems > visibleCount;

	return (
		<box
			width={width}
			height={height}
			border={true}
			borderStyle="rounded"
			borderColor={focused ? "#01AB95" : "#334155"}
			title=" Institutions "
			flexDirection="row"
		>
			<box flexDirection="column" flexGrow={1} minWidth={0}>
				{visibleInstitutions.map((inst, vi) => {
					const i = startIdx + vi;
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
			</box>
			{showScrollbar ? (
				<box width={1} flexDirection="column">
					{Array.from({ length: visibleCount * ITEM_HEIGHT }, (_, row) => {
						const trackHeight = visibleCount * ITEM_HEIGHT;
						const thumbSize = Math.max(1, Math.round((visibleCount / totalItems) * trackHeight));
						const thumbPos = Math.round((startIdx / Math.max(1, totalItems - visibleCount)) * (trackHeight - thumbSize));
						const isThumb = row >= thumbPos && row < thumbPos + thumbSize;
						return (
							<box key={row} height={1} width={1} backgroundColor={isThumb ? "#01CDB4" : "#334155"}>
								<text>{" "}</text>
							</box>
						);
					})}
				</box>
			) : null}
		</box>
	);
}
