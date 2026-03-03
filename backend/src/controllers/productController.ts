import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

// GET /api/products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
        const offset = (page - 1) * limit;
        const search = (req.query.search as string) || '';
        const sortBy = (req.query.sortBy as string) || 'created_at';
        const sortOrder = (req.query.sortOrder as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Whitelist sortable columns
        const allowedSortColumns = ['name', 'price', 'stock', 'created_at'];
        const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';

        let dataQuery: string;
        let countQuery: string;
        let params: unknown[];

        if (search.trim()) {
            dataQuery = `
        SELECT * FROM products
        WHERE name ILIKE $1
        ORDER BY ${safeSortBy} ${sortOrder}
        LIMIT $2 OFFSET $3
      `;
            countQuery = `SELECT COUNT(*) FROM products WHERE name ILIKE $1`;
            params = [`%${search.trim()}%`, limit, offset];
        } else {
            dataQuery = `
        SELECT * FROM products
        ORDER BY ${safeSortBy} ${sortOrder}
        LIMIT $1 OFFSET $2
      `;
            countQuery = `SELECT COUNT(*) FROM products`;
            params = [limit, offset];
        }

        const [dataResult, countResult] = await Promise.all([
            query(dataQuery, params),
            query(countQuery, search.trim() ? [`%${search.trim()}%`] : []),
        ]);

        const total = parseInt(countResult.rows[0].count);

        res.json({
            data: dataResult.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// POST /api/products
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, price, stock } = req.body;

        const result = await query(
            'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *',
            [name, price, stock]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, price, stock } = req.body;

        const result = await query(
            'UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *',
            [name, price, stock, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.json({ message: 'Product deleted successfully', product: result.rows[0] });
    } catch (error) {
        next(error);
    }
};
