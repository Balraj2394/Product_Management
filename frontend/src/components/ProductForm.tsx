import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/api';
import type { ProductFormData } from '../types/product';
import Toast from './Toast';
import type { ToastType } from './Toast';
import './ProductForm.css';

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        price: '',
        stock: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
        visible: boolean;
    }>({ message: '', type: 'success', visible: false });

    // Fetch existing product for edit mode
    useEffect(() => {
        if (isEditing && id) {
            const fetchProduct = async () => {
                setFetching(true);
                try {
                    const product = await productService.getProduct(Number(id));
                    setFormData({
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                    });
                } catch (error) {
                    console.error('Failed to fetch product:', error);
                    showToast('Failed to load product data', 'error');
                } finally {
                    setFetching(false);
                }
            };
            fetchProduct();
        }
    }, [id, isEditing]);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type, visible: true });
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        const price = Number(formData.price);
        if (!formData.price && formData.price !== 0) {
            newErrors.price = 'Price is required';
        } else if (isNaN(price) || price <= 0) {
            newErrors.price = 'Price must be a positive number';
        }

        const stock = Number(formData.stock);
        if (formData.stock === '' || formData.stock === undefined) {
            newErrors.stock = 'Stock is required';
        } else if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
            newErrors.stock = 'Stock must be a non-negative integer';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name as keyof ProductFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (isEditing && id) {
                await productService.updateProduct(Number(id), formData);
                showToast('Product updated successfully!', 'success');
            } else {
                await productService.createProduct(formData);
                showToast('Product created successfully!', 'success');
            }
            setTimeout(() => navigate('/'), 1200);
        } catch (error: unknown) {
            console.error('Failed to save product:', error);
            const axiosError = error as { response?: { data?: { error?: string; details?: Array<{ msg: string }> } } };
            const message =
                axiosError.response?.data?.details?.[0]?.msg ||
                axiosError.response?.data?.error ||
                'Failed to save product';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="form-page">
                <div className="form-card">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading product data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            <div className="form-card">
                <div className="form-header">
                    <button
                        className="btn btn-ghost back-btn"
                        onClick={() => navigate('/')}
                    >
                        ← Back
                    </button>
                    <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                    <p className="form-subtitle">
                        {isEditing
                            ? 'Update the product details below'
                            : 'Fill in the details to create a new product'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="product-form" id="product-form">
                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                        <label htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Wireless Headphones"
                            autoFocus
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-row">
                        <div className={`form-group ${errors.price ? 'has-error' : ''}`}>
                            <label htmlFor="price">Price ($)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                            {errors.price && <span className="error-text">{errors.price}</span>}
                        </div>

                        <div className={`form-group ${errors.stock ? 'has-error' : ''}`}>
                            <label htmlFor="stock">Stock Quantity</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                                step="1"
                                min="0"
                            />
                            {errors.stock && <span className="error-text">{errors.stock}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            id="submit-btn"
                        >
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </span>
                            ) : isEditing ? (
                                'Update Product'
                            ) : (
                                'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />
        </div>
    );
};

export default ProductForm;
