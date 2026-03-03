import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const productValidationRules = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Product name must be between 1 and 255 characters'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a positive number'),
    body('stock')
        .notEmpty()
        .withMessage('Stock is required')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            error: 'Validation failed',
            details: errors.array(),
        });
        return;
    }
    next();
};
