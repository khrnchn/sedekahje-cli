import type { Pagination } from "../types.ts";

interface StatusBarProps {
	pagination: Pagination | null;
	mode: "list" | "detail" | "search" | "filter";
}

const KEYBINDS: Record<string, string> = {
	list: "j/k:navigate  Tab:detail  /:search  f:filter  r:random  n/p:page  q:quit",
	detail: "Tab:list  o:open in browser  q:quit",
	search: "Enter:search  Esc:cancel",
	filter: "1-5:category  Esc:cancel",
};

export function StatusBar({ pagination, mode }: StatusBarProps) {
	const pageInfo = pagination
		? `Page ${pagination.page}/${pagination.totalPages} (${pagination.total} results)`
		: "Loading...";

	return (
		<box
			flexDirection="row"
			width="100%"
			height={1}
			backgroundColor="#1e293b"
		>
			<box flexGrow={1}>
				<text fg="#94a3b8">{` ${KEYBINDS[mode] ?? ""}`}</text>
			</box>
			<box width={35} justifyContent="flex-end">
				<text fg="#64748b">{`${pageInfo} `}</text>
			</box>
		</box>
	);
}
