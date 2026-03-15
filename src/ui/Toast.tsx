import {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	type ReactNode,
} from "react";
import { colors } from "./brand.ts";

type ToastVariant = "info" | "success" | "warning" | "error";

interface ToastItem {
	id: number;
	variant: ToastVariant;
	message: string;
	duration?: number;
}

interface ToastContextValue {
	show: (opts: {
		variant?: ToastVariant;
		message: string;
		duration?: number;
	}) => void;
	error: (err: unknown) => void;
}

const VARIANT_COLORS: Record<ToastVariant, string> = {
	info: "#2688FF",
	success: "#01AB95",
	warning: "#FED321",
	error: "#ef4444",
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within ToastProvider");
	return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const [nextId, setNextId] = useState(0);

	const show = useCallback(
		(opts: { variant?: ToastVariant; message: string; duration?: number }) => {
			const id = nextId;
			setNextId((n) => n + 1);
			const item: ToastItem = {
				id,
				variant: opts.variant ?? "info",
				message: opts.message,
				duration: opts.duration ?? 3000,
			};
			setToasts((prev) => [...prev, item]);
		},
		[nextId],
	);

	const error = useCallback(
		(err: unknown) => {
			const message = err instanceof Error ? err.message : String(err);
			show({ variant: "error", message });
		},
		[show],
	);

	const dismiss = useCallback((id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const value: ToastContextValue = { show, error };

	return (
		<ToastContext.Provider value={value}>
			{children}
			{toasts.map((t) => (
				<ToastItemComponent
					key={t.id}
					item={t}
					onDismiss={() => dismiss(t.id)}
				/>
			))}
		</ToastContext.Provider>
	);
}

interface ToastItemComponentProps {
	item: ToastItem;
	onDismiss: () => void;
}

function ToastItemComponent({ item, onDismiss }: ToastItemComponentProps) {
	useEffect(() => {
		const ms = item.duration ?? 3000;
		const id = setTimeout(onDismiss, ms);
		return () => clearTimeout(id);
	}, [item.duration, onDismiss]);

	const borderColor = VARIANT_COLORS[item.variant];

	return (
		<box
			position="absolute"
			top={1}
			right={2}
			width={40}
			border={true}
			borderStyle="rounded"
			borderColor={borderColor}
			backgroundColor={colors.bgLight}
			paddingLeft={1}
			paddingRight={1}
		>
			<text>
				<span fg={borderColor}>{"▌ "}</span>
				<span fg={colors.text}>{item.message}</span>
			</text>
		</box>
	);
}
