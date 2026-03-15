import { useState, useEffect } from "react";

const BRAILLE_FRAMES = [
	"⠋",
	"⠙",
	"⠹",
	"⠸",
	"⠼",
	"⠴",
	"⠦",
	"⠧",
	"⠇",
	"⠏",
];

interface SpinnerProps {
	label?: string;
	color?: string;
}

export function Spinner({ label, color = "#01CDB4" }: SpinnerProps) {
	const [frameIndex, setFrameIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setFrameIndex((i) => (i + 1) % BRAILLE_FRAMES.length);
		}, 80);
		return () => clearInterval(id);
	}, []);

	const char = BRAILLE_FRAMES[frameIndex] ?? BRAILLE_FRAMES[0];

	return (
		<text>
			<span fg={color}>{char}</span>
			{label ? <span fg="#94a3b8">{" " + label}</span> : null}
		</text>
	);
}
