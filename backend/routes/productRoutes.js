import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET filters for a specific category
router.get('/filters/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    
    // Extract unique values for filters
    const subcategoriesSet = new Set();
    const sizesSet = new Set();
    const colorsSet = new Set();
    const fitsSet = new Set();
    const categoryCounts = {};
    
    products.forEach(product => {
      // Subcategories
      if (product.subcategory) {
        subcategoriesSet.add(product.subcategory);
        categoryCounts[product.subcategory] = (categoryCounts[product.subcategory] || 0) + 1;
      }
      
      // Sizes
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(size => sizesSet.add(size));
      }
      
      // Colors
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach(color => colorsSet.add(color));
      }
      
      // Fit
      if (product.fit) {
        fitsSet.add(product.fit);
      }
    });
    
    res.json({
      success: true,
      data: {
        subcategories: Array.from(subcategoriesSet).sort(),
        sizes: Array.from(sizesSet).sort((a, b) => {
          const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL', '6XL'];
          return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
        }),
        colors: Array.from(colorsSet),
        fits: Array.from(fitsSet).sort(),
        categoryCounts
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST create new product (admin only)
router.post('/', async (req, res) => {
  try {
    console.log('Creating new product with data:', {
      id: req.body.id,
      name: req.body.name,
      category: req.body.category,
      hasImages: req.body.images ? req.body.images.length : 0,
      hasImage: !!req.body.image
    });
    
    const product = await Product.create(req.body);
    console.log('✅ Product created successfully:', product.id);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product with this ID already exists. Please use a different ID.' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ')
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;
