import axios from 'axios';
import type { Product, ProductFormData, PaginatedResponse, ProductQueryParams } from '../types/product';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productService = {
    getProducts: async (params: ProductQueryParams = {}): Promise<PaginatedResponse> => {
        const response = await api.get<PaginatedResponse>('/products', { params });
        return response.data;
    },

    getProduct: async (id: number): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    createProduct: async (data: ProductFormData): Promise<Product> => {
        const response = await api.post<Product>('/products', {
            name: data.name,
            price: Number(data.price),
            stock: Number(data.stock),
        });
        return response.data;
    },

    updateProduct: async (id: number, data: ProductFormData): Promise<Product> => {
        const response = await api.put<Product>(`/products/${id}`, {
            name: data.name,
            price: Number(data.price),
            stock: Number(data.stock),
        });
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await api.delete(`/products/${id}`);
    },
};
