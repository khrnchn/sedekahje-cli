import type {
	InstitutionCompact,
	SearchParams,
	SearchResponse,
} from "./types.ts";

const BASE_URL = "https://sedekah.je";

export async function searchInstitutions(
	params: SearchParams,
): Promise<SearchResponse> {
	const url = new URL("/api/institutions", BASE_URL);

	if (params.search) url.searchParams.set("search", params.search);
	if (params.category) url.searchParams.set("category", params.category);
	if (params.state) url.searchParams.set("state", params.state);
	if (params.page) url.searchParams.set("page", String(params.page));
	if (params.limit) url.searchParams.set("limit", String(params.limit));

	const res = await fetch(url.toString());
	if (!res.ok) {
		throw new Error(`API error: ${res.status} ${res.statusText}`);
	}
	return res.json() as Promise<SearchResponse>;
}

export async function getRandomInstitution(): Promise<InstitutionCompact> {
	const res = await fetch(`${BASE_URL}/api/random`);
	if (!res.ok) {
		throw new Error(`API error: ${res.status} ${res.statusText}`);
	}
	return res.json() as Promise<InstitutionCompact>;
}
