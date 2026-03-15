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
import { useFuzzySearch } from "./hooks/useFuzzySearch.ts";
import type { SearchParams } from "../types.ts";
import { colors } from "./brand.ts";
import { openUrl } from "../utils/open.ts";
import { useToast } from "./Toast.tsx";
import { useDialog } from "./Dialog.tsx";
import { HelpDialog } from "./HelpDialog.tsx";
import { CommandPalette, type Command } from "./CommandPalette.tsx";

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

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [focusedPane, setFocusedPane] = useState<"list" | "detail">("list");
	const [mode, setMode] = useState<"list" | "detail" | "search" | "filter">(
		"list",
	);

	// Compute content height and dynamic page limit to fill the list panel
	const contentHeight =
		height -
		1 - // header
		(mode === "search" ? 1 : 0) -
		(mode === "filter" ? 3 : 0) -
		(filters.state || filters.category ? 1 : 0) -
		2; // status bar
	const pageLimit = Math.max(
		15,
		Math.min(50, Math.floor((contentHeight - 2) / 2)),
	);
	const paramsWithLimit = { ...params, limit: pageLimit };

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
	} = useInstitutions(paramsWithLimit);
	const [searchInput, setSearchInput] = useState("");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const toast = useToast();
	const dialog = useDialog();

	// Re-fetch when filters or terminal size changes (limit depends on contentHeight)
	const prevParamsRef = useRef<string>("");
	useEffect(() => {
		const key = JSON.stringify(paramsWithLimit);
		if (key !== prevParamsRef.current) {
			prevParamsRef.current = key;
			fetchInstitutions({ ...paramsWithLimit, page: 1 });
			setSelectedIndex(0);
		}
	}, [paramsWithLimit, fetchInstitutions]);

	// Show API errors via toast
	useEffect(() => {
		if (error) toast.error(error);
	}, [error, toast]);

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

	const openCommandPalette = useCallback(() => {
		const commands: Command[] = [
			{
				id: "search",
				label: "Search",
				shortcut: "/",
				action: () => setMode("search"),
			},
			{
				id: "filter",
				label: "Filter by category",
				shortcut: "f",
				action: () => setMode("filter"),
			},
			{
				id: "random",
				label: "Random institution",
				shortcut: "r",
				action: () => fetchRandom(),
			},
			{
				id: "next",
				label: "Next page",
				shortcut: "n",
				action: () => {
					if (pagination?.hasMore) {
						nextPage();
						setSelectedIndex(0);
					} else {
						toast.show({ variant: "info", message: "No more pages" });
					}
				},
			},
			{
				id: "prev",
				label: "Prev page",
				shortcut: "p",
				action: () => {
					if (pagination && pagination.page > 1) {
						prevPage();
						setSelectedIndex(0);
					} else {
						toast.show({ variant: "info", message: "No more pages" });
					}
				},
			},
			{
				id: "open",
				label: "Open in browser",
				shortcut: "o",
				action: () => {
					const inst = institutions[selectedIndex];
					if (inst && "slug" in inst && inst.slug) {
						const url = `https://sedekah.je/${inst.category}/${inst.slug}`;
						try {
							openUrl(url);
							toast.show({ variant: "success", message: "Opening in browser..." });
						} catch {
							toast.error("Failed to open browser");
						}
					} else {
						toast.show({ variant: "warning", message: "No URL available" });
					}
				},
			},
			{
				id: "help",
				label: "Help",
				shortcut: "?",
				action: () => dialog.show(<HelpDialog />),
			},
			{
				id: "quit",
				label: "Quit",
				shortcut: "q",
				action: () => renderer.destroy(),
			},
		];
		dialog.show(
			<CommandPalette
				commands={commands}
				onClose={() => dialog.close()}
			/>,
		);
	}, [
		pagination,
		institutions,
		selectedIndex,
		nextPage,
		prevPage,
		fetchRandom,
		toast,
		dialog,
		renderer,
	]);

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
			if (key.ctrl && key.name === "p") {
				key.preventDefault();
				// Show command palette - use same commands as normal mode
				openCommandPalette();
				return;
			}
			if (key.name === "escape") {
				setMode("list");
				setFocusedPane("list");
				return;
			}
			if (key.name === "?") {
				dialog.show(<HelpDialog />);
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
			if (key.ctrl && key.name === "p") {
				key.preventDefault();
				openCommandPalette();
				return;
			}
			if (key.name === "escape") {
				setMode("list");
				return;
			}
			if (key.name === "?") {
				dialog.show(<HelpDialog />);
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
		if (key.ctrl && key.name === "p") {
			key.preventDefault();
			openCommandPalette();
			return;
		}
		if (key.name === "?") {
			dialog.show(<HelpDialog />);
			return;
		}
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
				if (pagination?.hasMore) {
					nextPage();
					setSelectedIndex(0);
				} else {
					toast.show({ variant: "info", message: "No more pages" });
				}
				break;
			case "p":
				if (pagination && pagination.page > 1) {
					prevPage();
					setSelectedIndex(0);
				} else {
					toast.show({ variant: "info", message: "No more pages" });
				}
				break;
			case "r":
				fetchRandom();
				break;
			case "o": {
				const inst = institutions[selectedIndex];
				if (inst && "slug" in inst && inst.slug) {
					const url = `https://sedekah.je/${inst.category}/${inst.slug}`;
					try {
						openUrl(url);
						toast.show({ variant: "success", message: "Opening in browser..." });
					} catch {
						toast.error("Failed to open browser");
					}
				} else {
					toast.show({ variant: "warning", message: "No URL available" });
				}
				break;
			}
			case "escape":
				if (filters.state || filters.category || searchInput) {
					clearFilters();
					setSearchInput("");
					toast.show({ variant: "info", message: "Filters cleared" });
				}
				break;
		}
	});

	// Responsive layout: list panel ~50% of width, explicit content height for proper scroll
	const listWidth = Math.min(60, Math.max(36, Math.floor(width * 0.5)));
	const isNarrow = width < 80;

	// Client-side fuzzy search when in search mode; otherwise use server data
	const displayInstitutions = useFuzzySearch(
		institutions,
		mode === "search" ? searchInput : "",
	);
	const displayIndex = Math.min(selectedIndex, displayInstitutions.length - 1);
	const selectedInst =
		randomInstitution && focusedPane === "detail"
			? randomInstitution
			: (displayInstitutions[displayIndex] ?? null);

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

			{/* Main content: two panes (or single pane when narrow) */}
			<box flexDirection="row" flexGrow={1} minHeight={0}>
				{(!isNarrow || focusedPane === "list") ? (
					<InstitutionList
						institutions={displayInstitutions}
						loading={loading}
						focused={focusedPane === "list"}
						selectedIndex={displayIndex}
						onSelect={setSelectedIndex}
						width={listWidth}
						height={contentHeight}
					/>
				) : null}
				{(!isNarrow || focusedPane === "detail") ? (
					<InstitutionDetail
						institution={selectedInst}
						focused={focusedPane === "detail"}
						availableWidth={isNarrow ? width : width - listWidth}
						onOpenUrl={(url) => {
							try {
								openUrl(url);
								toast.show({ variant: "success", message: "Opening in browser..." });
							} catch {
								toast.error("Failed to open browser");
							}
						}}
					/>
				) : null}
			</box>

			{/* Status bar */}
			<StatusBar pagination={pagination} mode={mode} />
		</box>
	);
}
