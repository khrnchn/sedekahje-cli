import { useState, useCallback } from "react";
import type { SearchParams } from "../../types.ts";

export interface Filters {
	search: string;
	state: string;
	category: string;
}

interface UseFiltersReturn {
	filters: Filters;
	params: SearchParams;
	setSearch: (value: string) => void;
	setState: (value: string) => void;
	setCategory: (value: string) => void;
	clearFilters: () => void;
}

export function useFilters(initial?: Partial<Filters>): UseFiltersReturn {
	const [filters, setFilters] = useState<Filters>({
		search: initial?.search ?? "",
		state: initial?.state ?? "",
		category: initial?.category ?? "",
	});

	const setSearch = useCallback((value: string) => {
		setFilters((f: Filters) => ({ ...f, search: value }));
	}, []);

	const setStateFilter = useCallback((value: string) => {
		setFilters((f: Filters) => ({ ...f, state: value }));
	}, []);

	const setCategory = useCallback((value: string) => {
		setFilters((f: Filters) => ({ ...f, category: value }));
	}, []);

	const clearFilters = useCallback(() => {
		setFilters({ search: "", state: "", category: "" });
	}, []);

	const params: SearchParams = {};
	if (filters.search) params.search = filters.search;
	if (filters.state) params.state = filters.state;
	if (filters.category) params.category = filters.category;

	return {
		filters,
		params,
		setSearch,
		setState: setStateFilter,
		setCategory,
		clearFilters,
	};
}
