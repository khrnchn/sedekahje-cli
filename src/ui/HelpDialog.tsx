import { colors } from "./brand.ts";

const SECTIONS = [
	{
		title: "Navigation",
		keys: [
			["j / ↓", "Down"],
			["k / ↑", "Up"],
			["g", "First"],
			["G", "Last"],
			["Tab", "Switch pane"],
		],
	},
	{
		title: "Search & Filter",
		keys: [
			["/", "Search"],
			["f", "Filter by category"],
			["Enter", "Submit search"],
			["Esc", "Cancel / Clear filters"],
		],
	},
	{
		title: "Actions",
		keys: [
			["r", "Random institution"],
			["o", "Open in browser"],
			["n", "Next page"],
			["p", "Prev page"],
			["Ctrl+P", "Command palette"],
			["?", "Help"],
			["q", "Quit"],
		],
	},
];

export function HelpDialog() {
	return (
		<box flexDirection="column">
			<text>
				<b fg={colors.tealLight}>{" Keybindings "}</b>
			</text>
			<box height={1} />
			{SECTIONS.map((section, i) => (
				<box key={i} flexDirection="column" marginBottom={1}>
					<text>
						<b fg={colors.teal}>{section.title}</b>
					</text>
					{section.keys.map(([key, desc], j) => (
						<text key={j}>
							<span fg={colors.text}>{"  "}</span>
							<b fg={colors.tealLight}>{key}</b>
							<span fg={colors.textDim}>{" — " + desc}</span>
						</text>
					))}
					<box height={1} />
				</box>
			))}
			<text fg={colors.textMuted}>{" Esc to close"}</text>
		</box>
	);
}
