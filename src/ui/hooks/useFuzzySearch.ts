import { useMemo } from "react";
import Fuse from "fuse.js";
import type { Institution, InstitutionCompact } from "../../types.ts";

const SEARCH_KEYS = ["name", "city", "state", "category"] as const;
const THRESHOLD = 0.4;

/**
 * Returns filtered institutions based on fuzzy search query.
 * Returns all items if query is empty.
 */
export function useFuzzySearch<T extends Institution | InstitutionCompact>(
	items: T[],
	query: string,
): T[] {
	return useMemo(() => {
		if (!query.trim()) return items;
		const fuse = new Fuse(items, {
			keys: [...SEARCH_KEYS],
			threshold: THRESHOLD,
		});
		return fuse.search(query).map((r) => r.item);
	}, [items, query]);
}
