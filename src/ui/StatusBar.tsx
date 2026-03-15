import type { Pagination } from "../types.ts";
import { colors } from "./brand.ts";
import { Spinner } from "./Spinner.tsx";

interface StatusBarProps {
	pagination: Pagination | null;
	mode: "list" | "detail" | "search" | "filter";
}

const KEYBINDS: Record<string, string> = {
	list: "j/k:navigate  Tab:detail  /:search  f:filter  r:random  n/p:page  ?:help  q:quit",
	detail: "Tab:list  o:open in browser  Ctrl+P:palette  ?:help  q:quit",
	search: "Enter:search  Esc:cancel  ?:help",
	filter: "1-5:category  Esc:cancel  ?:help",
};

export function StatusBar({ pagination, mode }: StatusBarProps) {
	const pageInfo = pagination
		? `Page ${pagination.page}/${pagination.totalPages} (${pagination.total} results)`
		: null;

	return (
		<box flexDirection="column" width="100%">
			<box
				flexDirection="row"
				width="100%"
				height={1}
				backgroundColor={colors.tealDark}
			>
				<box flexGrow={1}>
					<text fg={colors.tealLight}>{` ${KEYBINDS[mode] ?? ""}`}</text>
				</box>
				<box width={35} justifyContent="flex-end">
					{pageInfo ? (
						<text fg={colors.teal}>{`${pageInfo} `}</text>
					) : (
						<Spinner color={colors.teal} />
					)}
				</box>
			</box>
			<box height={1} width="100%" backgroundColor={colors.bg}>
				<text>
					<span fg={colors.textMuted}>{" buymeacoffee.com/"}</span>
					<span fg={colors.gold}>{"khairin"}</span>
				</text>
			</box>
		</box>
	);
}
