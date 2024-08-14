import express from 'express';
import multer from 'multer';
import {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct,
} from '../controller/product.controller.js';

const router = express.Router();

// Set up multer storage and file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Name files with a timestamp
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check for the correct field names for file uploads
        if (file.fieldname === 'mainPicture' || file.fieldname === 'additionalPictures') {
            cb(null, true);
        } else {
            cb(new Error('Unexpected field'), false);
        }
    }
});

// Route to create a product with image uploads
router.post(
    '/',
    upload.fields([
        { name: 'mainPicture', maxCount: 1 },
        { name: 'additionalPictures', maxCount: 4 },
    ]),
    createProduct
);

// Route to get all products
router.get('/', getAllProducts);

// Route to get a single product by ID
router.get('/:id', getSingleProduct);

// Route to delete a product by ID
router.delete('/:id', deleteProduct);

// Route to update a product by ID with image uploads
router.put(
    '/:id',
    upload.fields([
        { name: 'mainPicture', maxCount: 1 },
        { name: 'additionalPictures', maxCount: 4 },
    ]),
    updateProduct
);

export default router;
