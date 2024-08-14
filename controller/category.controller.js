import Category from '../model/category.model.js';
import Product from '../model/product.model.js';

export const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const newCategory = new Category({ categoryName });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'Categorie naam is verplicht' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, { categoryName }, { new: true });
    if (!updatedCategory) return res.status(404).json({ message: 'Categorie niet gevonden' });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ message: 'Categorie niet gevonden' });
    res.status(200).json({ message: 'Categorie succesvol verwijderd' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const limit = parseInt(req.query.limit, 10) || 4;

    const category = await Category.findOne({ categoryName: categoryName });
    if (!category) return res.status(404).json({ message: 'Categorie niet gevonden' });

    const products = await Product.find({ category: category._id }).limit(limit);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

