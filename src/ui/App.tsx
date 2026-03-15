import { useState, useEffect, useCallback, useRef } from "react";
import {
	useKeyboard,
	useRenderer,
	useTerminalDimensions,
} from "@opentui/react";
import { InstitutionList } from "./InstitutionList.tsx";
import { InstitutionDetail } from "./InstitutionDetail.tsx";
import { FilterBar } from "./FilterBar.tsx";
import { StatusBar } from "./StatusBar.tsx";
import { useInstitutions } from "./hooks/useInstitutions.ts";
import { useFilters } from "./hooks/useFilters.ts";
import type { SearchParams } from "../types.ts";
import { colors } from "./brand.ts";

const CATEGORIES = ["masjid", "surau", "tahfiz", "kebajikan", "lain-lain"];

interface AppProps {
	initialState?: string;
	initialCategory?: string;
}

export function App({ initialState, initialCategory }: AppProps) {
	const renderer = useRenderer();
	const { width, height } = useTerminalDimensions();

	const { filters, params, setSearch, setState, setCategory, clearFilters } =
		useFilters({
			state: initialState ?? "",
			category: initialCategory ?? "",
		});

	const {
		institutions,
		pagination,
		loading,
		error,
		fetch: fetchInstitutions,
		nextPage,
		prevPage,
		fetchRandom,
		randomInstitution,
	} = useInstitutions(params);

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [focusedPane, setFocusedPane] = useState<"list" | "detail">("list");
	const [mode, setMode] = useState<"list" | "detail" | "search" | "filter">(
		"list",
	);
	const [searchInput, setSearchInput] = useState("");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Re-fetch when filters change
	const prevParamsRef = useRef<string>("");
	useEffect(() => {
		const key = JSON.stringify(params);
		if (key !== prevParamsRef.current) {
			prevParamsRef.current = key;
			fetchInstitutions({ ...params, page: 1 });
			setSelectedIndex(0);
		}
	}, [params, fetchInstitutions]);

	// Show random institution in detail pane
	useEffect(() => {
		if (randomInstitution) {
			setFocusedPane("detail");
			setMode("detail");
		}
	}, [randomInstitution]);

	const handleSearchSubmit = useCallback(() => {
		setSearch(searchInput);
		setMode("list");
		setFocusedPane("list");
	}, [searchInput, setSearch]);

	useKeyboard((key) => {
		// Global: quit
		if (key.name === "q" && mode !== "search") {
			renderer.destroy();
			return;
		}
		if (key.ctrl && key.name === "c") {
			key.preventDefault();
			renderer.destroy();
			return;
		}

		// Search mode
		if (mode === "search") {
			if (key.name === "escape") {
				setMode("list");
				setFocusedPane("list");
				return;
			}
			if (key.name === "return") {
				handleSearchSubmit();
				return;
			}
			if (key.name === "backspace") {
				setSearchInput((s: string) => s.slice(0, -1));
				return;
			}
			if (key.raw && key.raw.length === 1 && !key.ctrl && !key.meta) {
				setSearchInput((s: string) => s + key.raw);
				return;
			}
			return;
		}

		// Filter mode
		if (mode === "filter") {
			if (key.name === "escape") {
				setMode("list");
				return;
			}
			const num = Number.parseInt(key.raw ?? "", 10);
			if (num >= 1 && num <= 5) {
				const cat = CATEGORIES[num - 1]!;
				setCategory(filters.category === cat ? "" : cat);
				setMode("list");
				return;
			}
			if (key.name === "c") {
				clearFilters();
				setSearchInput("");
				setMode("list");
				return;
			}
			return;
		}

		// Normal mode
		switch (key.name) {
			case "tab":
				setFocusedPane((p: "list" | "detail") => (p === "list" ? "detail" : "list"));
				setMode(() => (focusedPane === "list" ? "detail" : "list"));
				break;
			case "/":
				setMode("search");
				break;
			case "f":
				setMode("filter");
				break;
			case "n":
				nextPage();
				setSelectedIndex(0);
				break;
			case "p":
				prevPage();
				setSelectedIndex(0);
				break;
			case "r":
				fetchRandom();
				break;
			case "o": {
				const inst = institutions[selectedIndex];
				if (inst && "slug" in inst && inst.slug) {
					const url = `https://sedekah.je/${inst.category}/${inst.slug}`;
					// Use Bun.spawn to open URL in browser
					try {
						Bun.spawn(["xdg-open", url]);
					} catch {
						// Silently fail if can't open browser
					}
				}
				break;
			}
			case "escape":
				clearFilters();
				setSearchInput("");
				break;
		}
	});

	const selectedInst =
		randomInstitution && focusedPane === "detail"
			? randomInstitution
			: (institutions[selectedIndex] ?? null);

	return (
		<box
			flexDirection="column"
			width={width}
			height={height}
			backgroundColor={colors.bg}
		>
			{/* Header */}
			<box height={1} width="100%" backgroundColor={colors.tealDark} paddingLeft={1}>
				<text>
					<b fg={colors.tealLight}>sedekah.je</b>
					<span fg={colors.teal}>{" — browse Malaysian donation QR codes"}</span>
				</text>
			</box>

			{/* Search bar (when in search mode) */}
			{mode === "search" ? (
				<box height={1} width="100%" backgroundColor={colors.bgAccent} paddingLeft={1}>
					<text>
						<span fg={colors.tealLight}>{"/ "}</span>
						<span fg="#f8fafc">{searchInput}</span>
						<span fg={colors.tealLight}>{"█"}</span>
					</text>
				</box>
			) : null}

			{/* Filter mode overlay */}
			{mode === "filter" ? (
				<box
					height={3}
					width="100%"
					backgroundColor={colors.bgAccent}
					paddingLeft={1}
					flexDirection="column"
				>
					<text>
						<b fg={colors.tealLight}>{"Filter by category: "}</b>
						<span fg="#e2e8f0">
							{"1:masjid  2:surau  3:tahfiz  4:kebajikan  5:lain-lain  c:clear"}
						</span>
					</text>
					{filters.category ? (
						<text>
							<span fg="#94a3b8">{"Active: "}</span>
							<span fg="#22d3ee">{filters.category}</span>
						</text>
					) : null}
				</box>
			) : null}

			{/* Active filter pills */}
			<FilterBar filters={filters} />

			{/* Error display */}
			{error ? (
				<box height={1} width="100%" backgroundColor="#450a0a" paddingLeft={1}>
					<text fg="#fca5a5">{`Error: ${error}`}</text>
				</box>
			) : null}

			{/* Main content: two panes */}
			<box flexDirection="row" flexGrow={1}>
				<InstitutionList
					institutions={institutions}
					loading={loading}
					focused={focusedPane === "list"}
					selectedIndex={selectedIndex}
					onSelect={setSelectedIndex}
				/>
				<InstitutionDetail
					institution={selectedInst}
					focused={focusedPane === "detail"}
				/>
			</box>

			{/* Status bar */}
			<StatusBar pagination={pagination} mode={mode} />
		</box>
	);
}
