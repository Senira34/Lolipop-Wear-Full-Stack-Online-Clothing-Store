import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Wrapper to safely use notification
const CartProviderWithNotification = ({ children, notification }) => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Add item to cart
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.size === selectedSize && item.color === selectedColor
    )

    if (existingItemIndex !== -1) {
      // Item already exists, update quantity
      const updatedCart = [...cartItems]
      updatedCart[existingItemIndex].quantity += quantity
      setCartItems(updatedCart)
      if (notification) {
        notification.success(`${product.name} quantity updated in cart!`)
      }
    } else {
      // Add new item
      const newItem = {
        id: product.id,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: product.price,
        quantity,
        size: selectedSize,
        color: selectedColor
      }
      setCartItems([...cartItems, newItem])
      if (notification) {
        notification.success(`${product.name} added to cart successfully!`)
      }
    }
  }

  // Remove item from cart
  const removeFromCart = (id, size, color) => {
    const item = cartItems.find(item => item.id === id && item.size === size && item.color === color)
    setCartItems(cartItems.filter(
      item => !(item.id === id && item.size === size && item.color === color)
    ))
    if (notification && item) {
      notification.info(`${item.name} removed from cart`)
    }
  }

  // Update item quantity
  const updateQuantity = (id, size, color, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map(item =>
      item.id === id && item.size === size && item.color === color
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
    if (notification) {
      notification.info('Cart cleared successfully')
    }
  }

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  // Buy now - add to cart and navigate to cart
  const buyNow = (product, selectedSize, selectedColor, quantity = 1) => {
    addToCart(product, selectedSize, selectedColor, quantity)
    navigate('/cart')
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    buyNow
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const CartProvider = ({ children }) => {
  // Try to get notification hook
  let notification = null
  try {
    const { useNotification } = require('./NotificationContext')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    notification = useNotification()
  } catch (e) {
    // NotificationContext not available
  }

  return <CartProviderWithNotification notification={notification}>{children}</CartProviderWithNotification>
}
