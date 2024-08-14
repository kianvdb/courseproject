import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import multer from 'multer';
import AuthRoute from './router/auth.router.js';
import CategoryRoute from './router/category.router.js';
import ProductRoute from './router/product.router.js';
import WishlistRouter from './router/wishlist.router.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MongoDB_url = process.env.MONGODB_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', AuthRoute);
app.use('/api/category', CategoryRoute);
app.use('/api/products', ProductRoute);
app.use('/api/wishlist', WishlistRouter);

// Root route to handle GET requests to '/'
app.get('/', (req, res) => {
    res.send('Welkom bij de API! gebruik de juiste endpoints');
});

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
    mongoose.connect(MongoDB_url)
    .then(() => {
        console.log(`Database connected and server listening on ${PORT}`);
    })
    .catch((error) => {
        console.log('Database connection error:', error);
    });
});
