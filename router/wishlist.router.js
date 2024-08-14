import express from 'express';
import {
    addProductToWishlist,
    getAllProductsInWishlist,
    removeProductFromWishlist,
} from '../controller/wishlist.controller.js';

const router = express.Router();

router.post('/add/:userId/:productId', addProductToWishlist);
router.get('/:userId', getAllProductsInWishlist);
router.delete('/:userId/:productId', removeProductFromWishlist);

export default router;