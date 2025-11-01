import './App.css'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import MensClothing from './pages/MensClothing.jsx'
import WomenClothing from './pages/WomenClothing.jsx'
import ContactUs from './pages/Contactus.jsx'
import Footer from './components/Footer.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import MyOrders from './pages/MyOrders.jsx'
import Productdetails from './pages/Productdetails.jsx'
import Dashboard from './components/Dashboard.jsx'
import MyProfile from './pages/MyProfile.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import NotificationContainer from './components/Notification.jsx'


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <div className="app-root relative min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/men" element={<MensClothing/>} />
              <Route path="/women" element={<WomenClothing/>} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/product/:id" element={<Productdetails />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<MyProfile />} />
            </Routes>
            <NotificationContainer />
          </div>
          <Footer />
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

