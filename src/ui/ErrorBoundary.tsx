import { Component } from "react";
import type React from "react";
import { useKeyboard, useRenderer } from "@opentui/react";
import { colors } from "./brand.ts";

interface ErrorBoundaryProps {
	children: React.ReactNode;
	onRetry?: () => void;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

/** Custom error boundary with retry/quit keybinds and styled error screen */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(
		error: Error,
	): ErrorBoundaryState {
		return { hasError: true, error };
	}

	override render(): React.ReactNode {
		if (this.state.hasError && this.state.error) {
			return (
				<ErrorScreen
					error={this.state.error}
					onRetry={() => {
						this.setState({ hasError: false, error: null });
						this.props.onRetry?.();
					}}
				/>
			);
		}
		return this.props.children;
	}
}

interface ErrorScreenProps {
	error: Error;
	onRetry: () => void;
}

function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
	const renderer = useRenderer();

	useKeyboard((key) => {
		if (key.name === "r") {
			onRetry();
		} else if (key.name === "q") {
			renderer.destroy();
		}
	});

	const stack = error.stack ?? error.message;

	return (
		<box
			flexDirection="column"
			width="100%"
			height="100%"
			border={true}
			borderStyle="rounded"
			borderColor="#ef4444"
			padding={1}
		>
			<text>
				<b fg="#ef4444">{"Error: "}</b>
				<span fg="#fca5a5">{error.message}</span>
			</text>
			<box height={1} />
			<scrollbox focused={true} flexGrow={1}>
				<text fg="#94a3b8">{stack}</text>
			</scrollbox>
			<box height={1} />
			<text fg={colors.textMuted}>
				{" r: retry  q: quit"}
			</text>
		</box>
	);
}
