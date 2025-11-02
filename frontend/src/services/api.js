// Base API URL - Uses environment variable or defaults to /api for production
export const API_URL = import.meta.env.VITE_API_URL || '/api';

// ============================================
// PRODUCT API CALLS
// ============================================

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get single product by ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get products by category (men/women)
export const getProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// ============================================
// USER API CALLS
// ============================================

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save user data to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save user data to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('userInfo');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/profile/${userId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/users/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// ============================================
// CART API CALLS
// ============================================

// Add item to cart
export const addToCart = async (userId, cartItem) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItem),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Get user cart
export const getUserCart = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/cart`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// ============================================
// ORDER API CALLS
// ============================================

// Create new order
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Get all orders for a user
export const getUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/orders/user/${userId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Update order payment status
export const updateOrderPayment = async (orderId, paymentData) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Error updating order payment:', error);
    throw error;
  }
};
