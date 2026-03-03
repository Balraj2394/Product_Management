import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController';
import { productValidationRules, handleValidationErrors } from '../middleware/validate';

const router = Router();

// GET /api/products - List products with pagination, search, sorting
router.get('/', getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

// POST /api/products - Create a new product
router.post('/', productValidationRules, handleValidationErrors, createProduct);

// PUT /api/products/:id - Update a product
router.put('/:id', productValidationRules, handleValidationErrors, updateProduct);

// DELETE /api/products/:id - Delete a product
router.delete('/:id', deleteProduct);

export default router;
