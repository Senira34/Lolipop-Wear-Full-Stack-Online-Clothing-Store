import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kids', 'accessories']
  },
  subcategory: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  fabric: {
    type: String,
    default: ''
  },
  fit: {
    type: String,
    enum: ['Regular Fit', 'Slim Fit', 'Oversized', 'Relaxed Fit'],
    default: 'Regular Fit'
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  colors: [{
    type: String
  }],
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: String,
    comment: String,
    rating: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
