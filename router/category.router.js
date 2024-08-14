import express from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory, getProductsByCategory } from '../controller/category.controller.js';

const router = express.Router();

router.post('/', createCategory); // POST /api/category/
router.get('/', getAllCategories); // GET /api/category/
router.put('/:id', updateCategory); // PUT /api/category/:id
router.delete('/:id', deleteCategory); // DELETE /api/category/:id
router.get('/:categoryName/products', getProductsByCategory); // GET /api/category/:categoryName/products

export default router;
