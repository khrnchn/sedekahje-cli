import type { Filters } from "./hooks/useFilters.ts";

interface FilterBarProps {
	filters: Filters;
}

function pill(label: string, value: string, color: string): string {
	if (!value) return "";
	return ` [${label}: ${value}] `;
}

export function FilterBar({ filters }: FilterBarProps) {
	const pills: string[] = [];
	if (filters.state) pills.push(`state:${filters.state}`);
	if (filters.category) pills.push(`category:${filters.category}`);

	if (pills.length === 0) return null;

	return (
		<box height={1} width="100%">
			<text>
				{pills.map((p, i) => (
					<span key={i} fg="#0ea5e9" bg="#0c4a6e">
						{` ${p} `}
					</span>
				))}
			</text>
		</box>
	);
}
