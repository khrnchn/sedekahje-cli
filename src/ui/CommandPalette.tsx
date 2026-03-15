import { useState, useEffect, useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import Fuse from "fuse.js";
import { colors } from "./brand.ts";

export interface Command {
	id: string;
	label: string;
	shortcut?: string;
	action: () => void;
}

interface CommandPaletteProps {
	commands: Command[];
	onClose: () => void;
}

export function CommandPalette({ commands, onClose }: CommandPaletteProps) {
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);

	const fuse = new Fuse(commands, {
		keys: ["label", "shortcut"],
		threshold: 0.4,
	});

	const filtered =
		query.trim() === ""
			? commands
			: fuse.search(query).map((r) => r.item);
	const clampedIndex = Math.min(selectedIndex, Math.max(0, filtered.length - 1));

	useEffect(() => {
		setSelectedIndex(0);
	}, [query]);

	useEffect(() => {
		if (clampedIndex !== selectedIndex) {
			setSelectedIndex(clampedIndex);
		}
	}, [filtered.length]);

	const execute = useCallback(() => {
		const cmd = filtered[clampedIndex];
		if (cmd) {
			onClose();
			cmd.action();
		}
	}, [filtered, clampedIndex, onClose]);

	useKeyboard((key) => {
		if (key.name === "escape") {
			onClose();
			return;
		}
		if (key.name === "return") {
			execute();
			return;
		}
		if (key.name === "j" || key.name === "down") {
			setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
			return;
		}
		if (key.name === "k" || key.name === "up") {
			setSelectedIndex((i) => Math.max(i - 1, 0));
			return;
		}
		if (key.name === "backspace") {
			setQuery((q) => q.slice(0, -1));
			return;
		}
		if (key.raw && key.raw.length === 1 && !key.ctrl && !key.meta) {
			setQuery((q) => q + key.raw);
			return;
		}
	});

	return (
		<box flexDirection="column" width={50}>
			<box height={1} marginBottom={1}>
				<text>
					<span fg={colors.tealLight}>{"› "}</span>
					<span fg={colors.text}>{query}</span>
					<span fg={colors.tealLight}>{"█"}</span>
				</text>
			</box>
			<scrollbox focused={true} height={12}>
				{filtered.length === 0 ? (
					<text fg={colors.textMuted}>{"No commands match"}</text>
				) : (
					filtered.map((cmd, i) => {
						const isSelected = i === clampedIndex;
						return (
							<box
								key={cmd.id}
								height={1}
								backgroundColor={isSelected ? "#1e3a5f" : "transparent"}
								paddingLeft={1}
							>
								<text>
									{isSelected ? (
										<span fg={colors.tealLight}>{`> ${cmd.label}`}</span>
									) : (
										<span fg={colors.text}>{`  ${cmd.label}`}</span>
									)}
									{cmd.shortcut ? (
										<span fg={colors.textMuted}>{`  (${cmd.shortcut})`}</span>
									) : null}
								</text>
							</box>
						);
					})
				)}
			</scrollbox>
			<box height={1} />
			<text fg={colors.textMuted}>
				{" j/k:navigate  Enter:execute  Esc:close"}
			</text>
		</box>
	);
}
