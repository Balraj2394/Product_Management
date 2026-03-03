export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    created_at: string;
}

export interface ProductFormData {
    name: string;
    price: number | string;
    stock: number | string;
}

export interface PaginatedResponse {
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
