import { useState, useEffect, useCallback, useRef } from "react";
import { searchInstitutions, getRandomInstitution } from "../../api.ts";
import type {
	Institution,
	InstitutionCompact,
	Pagination,
	SearchParams,
} from "../../types.ts";

interface UseInstitutionsState {
	institutions: Institution[];
	pagination: Pagination | null;
	loading: boolean;
	error: string | null;
}

interface UseInstitutionsReturn extends UseInstitutionsState {
	fetch: (params: SearchParams) => void;
	nextPage: () => void;
	prevPage: () => void;
	fetchRandom: () => void;
	randomInstitution: InstitutionCompact | null;
}

export function useInstitutions(
	initialParams?: SearchParams,
): UseInstitutionsReturn {
	const [state, setState] = useState<UseInstitutionsState>({
		institutions: [],
		pagination: null,
		loading: true,
		error: null,
	});
	const [randomInstitution, setRandomInstitution] =
		useState<InstitutionCompact | null>(null);
	const paramsRef = useRef<SearchParams>(initialParams ?? {});

	const doFetch = useCallback((params: SearchParams) => {
		paramsRef.current = params;
		setState((prev: UseInstitutionsState) => ({ ...prev, loading: true, error: null }));

		searchInstitutions(params)
			.then((data) => {
				setState({
					institutions: data.institutions,
					pagination: data.pagination,
					loading: false,
					error: null,
				});
			})
			.catch((err: Error) => {
				setState((prev: UseInstitutionsState) => ({
					...prev,
					loading: false,
					error: err.message,
				}));
			});
	}, []);

	const nextPage = useCallback(() => {
		const p = paramsRef.current;
		const currentPage = p.page ?? 1;
		if (state.pagination && state.pagination.hasMore) {
			doFetch({ ...p, page: currentPage + 1 });
		}
	}, [state.pagination, doFetch]);

	const prevPage = useCallback(() => {
		const p = paramsRef.current;
		const currentPage = p.page ?? 1;
		if (currentPage > 1) {
			doFetch({ ...p, page: currentPage - 1 });
		}
	}, [doFetch]);

	const fetchRandom = useCallback(() => {
		getRandomInstitution()
			.then((inst) => setRandomInstitution(inst))
			.catch(() => {});
	}, []);

	useEffect(() => {
		doFetch(initialParams ?? {});
	}, []);

	return {
		...state,
		fetch: doFetch,
		nextPage,
		prevPage,
		fetchRandom,
		randomInstitution,
	};
}
