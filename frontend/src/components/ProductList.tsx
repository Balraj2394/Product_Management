import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import type { Product } from '../types/product';
import { useDebounce } from '../hooks/useDebounce';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';
import type { ToastType } from './Toast';
import './ProductList.css';

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(8);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    // Delete dialog state
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
        visible: boolean;
    }>({ message: '', type: 'success', visible: false });

    const debouncedSearch = useDebounce(search, 300);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts({
                page,
                limit,
                search: debouncedSearch,
                sortBy,
                sortOrder,
            });
            setProducts(response.data);
            setTotalPages(response.totalPages);
            setTotal(response.total);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showToast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch, sortBy, sortOrder]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type, visible: true });
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
        } else {
            setSortBy(column);
            setSortOrder('ASC');
        }
        setPage(1);
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return '↕';
        return sortOrder === 'ASC' ? '↑' : '↓';
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            // Optimistic UI: remove from list immediately
            setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
            await productService.deleteProduct(deleteTarget.id);
            showToast(`"${deleteTarget.name}" deleted successfully`, 'success');
            setDeleteTarget(null);
            // Refetch to sync pagination counts
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
            showToast('Failed to delete product', 'error');
            // Revert optimistic update
            fetchProducts();
        } finally {
            setIsDeleting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className="product-list-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>Products</h1>
                        <p className="subtitle">
                            {total} {total === 1 ? 'product' : 'products'} in inventory
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/add')}
                        id="add-product-btn"
                    >
                        <span className="btn-icon">+</span>
                        Add Product
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        id="search-input"
                    />
                    {search && (
                        <button
                            className="search-clear"
                            onClick={() => setSearch('')}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No products found</h3>
                        <p>
                            {search
                                ? 'Try adjusting your search terms'
                                : 'Get started by adding your first product'}
                        </p>
                        {!search && (
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/add')}
                            >
                                Add Product
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <table className="product-table" id="product-table">
                            <thead>
                                <tr>
                                    <th className="th-name">Name</th>
                                    <th
                                        className="th-sortable"
                                        onClick={() => handleSort('price')}
                                        id="sort-price"
                                    >
                                        Price{' '}
                                        <span className="sort-icon">{getSortIcon('price')}</span>
                                    </th>
                                    <th
                                        className="th-sortable"
                                        onClick={() => handleSort('stock')}
                                        id="sort-stock"
                                    >
                                        Stock{' '}
                                        <span className="sort-icon">{getSortIcon('stock')}</span>
                                    </th>
                                    <th className="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="product-row">
                                        <td className="td-name">
                                            <span className="product-name">{product.name}</span>
                                        </td>
                                        <td className="td-price">{formatPrice(product.price)}</td>
                                        <td className="td-stock">
                                            <span
                                                className={`stock-badge ${product.stock === 0
                                                    ? 'stock-out'
                                                    : product.stock < 10
                                                        ? 'stock-low'
                                                        : 'stock-ok'
                                                    }`}
                                            >
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="td-actions">
                                            <button
                                                className="btn btn-sm btn-edit"
                                                onClick={() => navigate(`/edit/${product.id}`)}
                                                title="Edit product"
                                                id={`edit-btn-${product.id}`}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-delete"
                                                onClick={() => setDeleteTarget(product)}
                                                title="Delete product"
                                                id={`delete-btn-${product.id}`}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination" id="pagination">
                                <button
                                    className="btn btn-sm btn-page"
                                    disabled={page <= 1}
                                    onClick={() => setPage(1)}
                                >
                                    ««
                                </button>
                                <button
                                    className="btn btn-sm btn-page"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    «
                                </button>
                                <span className="page-info">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="btn btn-sm btn-page"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    »
                                </button>
                                <button
                                    className="btn btn-sm btn-page"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(totalPages)}
                                >
                                    »»
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                isLoading={isDeleting}
            />

            {/* Toast notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />
        </div>
    );
};

export default ProductList;
