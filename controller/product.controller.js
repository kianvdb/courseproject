import Product from '../model/product.model.js';
import Category from '../model/category.model.js';

export const createProduct = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);

        const { name, duur, kosten, moeilijkheid, inleid, ranking, category } = req.body;
        const mainPicture = req.files['mainPicture'] ? req.files['mainPicture'][0].path : '';
        const additionalPictures = req.files['additionalPictures'] ? req.files['additionalPictures'].map(file => file.path) : [];

        if (!name || !duur || !kosten || !moeilijkheid || !inleid || !ranking || !category) {
            return res.status(400).send({ error: "Vul alle velden in" });
        }

        const categoryDoc = await Category.findOne({ categoryName: category });
        if (!categoryDoc) {
            return res.status(404).send({ error: "Categorie niet gevonden" });
        }

        const newProduct = new Product({
            name,
            category: categoryDoc._id,
            duur,
            kosten,
            moeilijkheid,
            inleid,
            ranking,
            mainPicture,
            additionalPictures,
        });

        const savedProduct = await newProduct.save();
        res.status(201).send(savedProduct);
    } catch (error) {
        console.log(`Error in createProduct controller: ${error.message}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, duur, kosten, moeilijkheid, inleid, ranking, category } = req.body;
        const mainPicture = req.files['mainPicture'] ? req.files['mainPicture'][0].path : '';
        const additionalPictures = req.files['additionalPictures'] ? req.files['additionalPictures'].map(file => file.path) : [];

        const categoryDoc = await Category.findOne({ categoryName: category });
        if (!categoryDoc) {
            return res.status(404).send({ error: "Categorie niet gevonden" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                category: categoryDoc._id,
                duur,
                kosten,
                moeilijkheid,
                inleid,
                ranking,
                mainPicture,
                additionalPictures,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ error: "Project niet gevonden" });
        }

        res.status(200).send(updatedProduct);
    } catch (error) {
        console.log(`Error in updateProduct controller: ${error.message}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');
        if (!product) return res.status(404).json({ message: 'Project niet gevonden' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: 'Project niet gevonden' });
        res.status(200).json({ message: 'Project succesvol verwijderd' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
