import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const router = express.Router();

// Create payment intent for Stripe
router.post('/create-payment-intent', async (req, res) => {
  try {
    // Initialize Stripe here (inside the route) to ensure env vars are loaded
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    
    const { amount, shippingInfo, cartItems } = req.body

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      })
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd', // Using USD for better compatibility (change to 'lkr' in production if needed)
      payment_method_types: ['card'],
      metadata: {
        shippingName: shippingInfo.fullName,
        shippingEmail: shippingInfo.email,
        shippingPhone: shippingInfo.phone,
      },
    })

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    })
  }
})

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST create new order
router.post('/', async (req, res) => {
  try {
    console.log('=== Creating Order ===')
    console.log('Request body:', JSON.stringify(req.body, null, 2))
    
    const {
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid,
      paidAt,
      orderStatus,
      paymentResult
    } = req.body;

    // Validation
    if (!orderItems || orderItems.length === 0) {
      console.log('Error: No order items provided')
      return res.status(400).json({ 
        success: false, 
        message: 'No order items provided' 
      });
    }

    if (!shippingAddress) {
      console.log('Error: No shipping address provided')
      return res.status(400).json({ 
        success: false, 
        message: 'Shipping address is required' 
      });
    }

    if (!paymentMethod) {
      console.log('Error: No payment method provided')
      return res.status(400).json({ 
        success: false, 
        message: 'Payment method is required' 
      });
    }

    // Prepare order data
    const orderData = {
      user: (user && user !== 'guest') ? user : null,
      orderItems: orderItems.map(item => ({
        product: item.product || null,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        image: item.image
      })),
      shippingAddress,
      paymentMethod,
      paymentResult: paymentResult || {},
      itemsPrice: itemsPrice || 0,
      shippingPrice: shippingPrice || 0,
      taxPrice: taxPrice || 0,
      totalPrice: totalPrice || 0,
      isPaid: isPaid || false,
      paidAt: isPaid && paidAt ? new Date(paidAt) : null,
      orderStatus: orderStatus || 'Pending'
    };

    console.log('Creating order with data:', JSON.stringify(orderData, null, 2))

    const order = await Order.create(orderData);

    console.log('✅ Order created successfully with ID:', order._id)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Error creating order:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    res.status(400).json({ 
      success: false, 
      message: error.message,
      error: error.toString()
    });
  }
});

// GET order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    order.orderStatus = req.body.status || order.orderStatus;

    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// PUT update order to paid
router.put('/:id/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      emailAddress: req.body.email_address
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;
