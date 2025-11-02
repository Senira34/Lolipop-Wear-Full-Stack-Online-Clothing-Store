import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { LoginModal } from '../pages/LoginSignup'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { getCartItemCount } = useCart()
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between w-full py-2 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur-md bg-white/90 text-slate-800 text-sm border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/"><img src="/src/assets/logo.3.png" alt="Logo" className="h-16 w-auto object-contain" /></Link>
          <Link to="/" className="text-2xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
            Lolipop Wear
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <Link to="/" className="hover:text-indigo-600 transition font-medium">
            Home
          </Link>
          <Link to="/men" className="hover:text-indigo-600 transition font-medium">
            Men
          </Link>
          <Link to="/women" className="hover:text-indigo-600 transition font-medium">
            Women
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition font-medium">
            Contact Us
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 relative z-50">

          {/* Cart Icon */}
          <Link to="/cart"><button className="relative p-2 hover:bg-indigo-50 rounded-full transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {getCartItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </button></Link>

          {/* User Authentication Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="flex items-center gap-2 p-2 hover:bg-indigo-50 rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="font-medium">{user.name}</span>
                {isAdmin() && (
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">Admin</span>
                )}
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-9999" style={{ position: 'absolute' }}>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate" title={user.email}>{user.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    My Profile
                  </Link>
                  {!isAdmin() && (
                    <Link 
                      to="/my-orders" 
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 3h5v5"/>
                        <path d="M8 3H3v5"/>
                        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/>
                        <path d="m15 9 6-6"/>
                      </svg>
                      My Orders
                    </Link>
                  )}
                  {isAdmin() && (
                    <Link 
                      to="/admin/dashboard" 
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition font-medium border-t border-gray-200 mt-1 pt-2.5"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="9" x="3" y="3" rx="1"/>
                        <rect width="7" height="5" x="14" y="3" rx="1"/>
                        <rect width="7" height="9" x="14" y="12" rx="1"/>
                        <rect width="7" height="5" x="3" y="16" rx="1"/>
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout()
                      setShowUserMenu(false)
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-200 mt-1 pt-2.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" x2="9" y1="12" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>

              {/* User Profile Icon */}
              <button onClick={() => setLoginOpen(true)} className="p-2 hover:bg-indigo-50 rounded-full transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>

              {/* Sign in Button */}
              <button onClick={() => setLoginOpen(true)} className="px-6 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all rounded-full cursor-pointer">
                Sign in
              </button>
            </>
          )}
        </div>

        <button id="open-menu" onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition text-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div id="mobile-navLinks" className={`fixed inset-0 z-100 bg-black/40 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/men" onClick={() => setMenuOpen(false)}>
          Men
        </Link>
        <Link to="/women" onClick={() => setMenuOpen(false)}>
          Women
        </Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Contact Us
        </Link>
        <button id="close-menu" onClick={() => setMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-white hover:bg-slate-200 transition text-black rounded-md flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      {/* Login Modal */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}

export default Navbar
