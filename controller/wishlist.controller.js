import Wishlist from '../model/wishlist.model.js';
import Product from '../model/product.model.js';

export const addProductToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    const savedWishlist = await wishlist.save();
    res.status(200).json(savedWishlist);
  } catch (error) {
    console.error(`Error adding product to wishlist: ${error.message}`);
    res.status(500).json({ message: `Error adding product to wishlist: ${error.message}` });
  }
};

export const getAllProductsInWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const wishlist = await Wishlist.findOne({ userId }).populate('products');
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json(wishlist.products);
  } catch (error) {
    console.error(`Error fetching wishlist products: ${error.message}`);
    res.status(500).json({ message: `Error fetching wishlist products: ${error.message}` });
  }
};


export const removeProductFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'User ID and Product ID are required' });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    // Filter out the product
    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    const updatedWishlist = await wishlist.save();

    res.status(200).json({ success: true, wishlist: updatedWishlist });
  } catch (error) {
    console.error(`Error removing product from wishlist: ${error.message}`);
    res.status(500).json({ success: false, message: `Error removing product from wishlist: ${error.message}` });
  }
};

