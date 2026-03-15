import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
} from "react";
import { useKeyboard, useTerminalDimensions, useRenderer } from "@opentui/react";
import { colors } from "./brand.ts";
import { copySelection } from "../utils/selection.ts";
import { useToast } from "./Toast.tsx";

interface DialogContextValue {
	show: (element: ReactNode) => void;
	close: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog(): DialogContextValue {
	const ctx = useContext(DialogContext);
	if (!ctx) throw new Error("useDialog must be used within DialogProvider");
	return ctx;
}

export function DialogProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<ReactNode | null>(null);
	const { width, height } = useTerminalDimensions();
	const renderer = useRenderer();
	const toast = useToast();

	const show = useCallback((element: ReactNode) => {
		setContent(element);
	}, []);

	const close = useCallback(() => {
		setContent(null);
	}, []);

	useKeyboard((key) => {
		if (content && key.name === "escape") {
			close();
		}
	});

	const value: DialogContextValue = { show, close };

	return (
		<DialogContext.Provider value={value}>
			{children}
			{content ? (
				<box
					position="absolute"
					top={0}
					left={0}
					width={width}
					height={height}
					backgroundColor="#0a0a0f"
					justifyContent="center"
					alignItems="center"
					onMouseUp={() => copySelection(renderer, toast)}
				>
					<box
						width={Math.min(60, width - 4)}
						border={true}
						borderStyle="rounded"
						borderColor={colors.borderFocused}
						backgroundColor={colors.bg}
						padding={2}
					>
						{content}
					</box>
				</box>
			) : null}
		</DialogContext.Provider>
	);
}
