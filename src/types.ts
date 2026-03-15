export type Category = "masjid" | "surau" | "tahfiz" | "kebajikan" | "lain-lain";

export type PaymentMethod = "duitnow" | "tng" | "boost" | "toyyibpay";

export interface Institution {
	id: number;
	name: string;
	slug: string;
	description: string | null;
	category: Category;
	state: string;
	city: string;
	qrImage: string | null;
	qrContent: string | null;
	supportedPayment: PaymentMethod[] | null;
	coords: [number, number] | null;
}

/** Random endpoint returns a subset of fields (no slug/description) */
export interface InstitutionCompact {
	id: number;
	name: string;
	category: Category;
	state: string;
	city: string;
	qrImage: string | null;
	qrContent: string | null;
	supportedPayment: PaymentMethod[] | null;
	coords: [number, number] | null;
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	hasMore: boolean;
	totalPages: number;
}

export interface SearchParams {
	search?: string;
	category?: string;
	state?: string;
	page?: number;
	limit?: number;
}

export interface SearchResponse {
	institutions: Institution[];
	pagination: Pagination;
}
