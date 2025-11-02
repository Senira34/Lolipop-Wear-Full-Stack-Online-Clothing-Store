import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const notification = useNotification()
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })

  // Reset all states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset all states when modal opens
      setLoading(false)
      setIsSignup(false)
      setLoginData({ email: '', password: '' })
      setSignupData({ name: '', email: '', password: '', role: 'user' })
    }
  }, [isOpen])

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userData = await loginUser(loginData.email, loginData.password)
      login(userData) // Update auth context
      notification.success('Login successful! Welcome back!')
      console.log('User logged in:', userData)
      
      // Reset form
      setLoginData({ email: '', password: '' })
      
      // Close modal and navigate to home after a brief moment
      setTimeout(() => {
        onClose()
        navigate('/')
      }, 500)
    } catch (err) {
      notification.error(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Handle signup form submit
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userData = await registerUser(signupData)
      login(userData) // Update auth context
      notification.success('Account created successfully! Welcome to our store!')
      console.log('User registered:', userData)
      
      // Reset form
      setSignupData({ name: '', email: '', password: '', role: 'user' })
      
      // Close modal and navigate to home after a brief moment
      setTimeout(() => {
        onClose()
        navigate('/')
      }, 500)
    } catch (err) {
      notification.error(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle login input changes
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  // Handle signup input changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData({
      ...signupData,
      [name]: value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      {!isSignup ? (
        <div className="bg-white text-gray-500 max-w-96 w-full md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Welcome Back</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <input 
              name="email" 
              className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" 
              type="email" 
              placeholder="Enter your email" 
              value={loginData.email}
              onChange={handleLoginChange}
              required 
            />
            <input 
              name="password" 
              className="w-full bg-transparent border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4" 
              type="password" 
              placeholder="Enter your password" 
              value={loginData.password}
              onChange={handleLoginChange}
              required 
            />
            <div className="text-right py-4">
              <a className="text-blue-600 underline" href="#">Forgot Password</a>
            </div>
            <button 
              type="submit" 
              className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 py-2.5 rounded-full text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <p className="text-center mt-4">Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(true); }} className="text-blue-500 underline">Signup</a></p>
          <button type="button" className="w-full flex items-center gap-2 justify-center mt-5 bg-black hover:bg-gray-900 py-2.5 rounded-full text-white transition">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/appleLogo.png" alt="appleLogo" />
            Log in with Apple
          </button>
          <button type="button" className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 hover:bg-gray-50 py-2.5 rounded-full text-gray-800 transition">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="googleFavicon" />
            Log in with Google
          </button>
        </div>
      ) : (
        <div className="bg-white text-gray-500 max-w-96 w-full md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Create Account</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          {/* Signup Form */}
          <form onSubmit={handleSignup}>
            <input 
              name="name" 
              className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" 
              type="text" 
              placeholder="Enter your name" 
              value={signupData.name}
              onChange={handleSignupChange}
              required 
            />
            <input 
              name="email" 
              className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" 
              type="email" 
              placeholder="Enter your email" 
              value={signupData.email}
              onChange={handleSignupChange}
              required 
            />
            <input 
              name="password" 
              className="w-full bg-transparent border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4" 
              type="password" 
              placeholder="Enter your password" 
              value={signupData.password}
              onChange={handleSignupChange}
              required 
            />
           
            {/* Role Selection */}
            <div className="mt-4">
              <label className="block text-gray-700 mb-2 text-sm font-medium">Select Role</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="user" 
                    checked={signupData.role === 'user'}
                    onChange={handleSignupChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-gray-700">User</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="admin" 
                    checked={signupData.role === 'admin'}
                    onChange={handleSignupChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-gray-700">Admin</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full mt-6 mb-3 bg-indigo-500 hover:bg-indigo-600 py-2.5 rounded-full text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          <p className="text-center mt-4">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(false); }} className="text-blue-500 underline">Login</a></p>
          <button type="button" className="w-full flex items-center gap-2 justify-center mt-5 bg-black hover:bg-gray-900 py-2.5 rounded-full text-white transition">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/appleLogo.png" alt="appleLogo" />
            Sign up with Apple
          </button>
          <button type="button" className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 hover:bg-gray-50 py-2.5 rounded-full text-gray-800 transition">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="googleFavicon" />
            Sign up with Google
          </button>
        </div>
      )}
    </div>
  )
}

export { LoginModal }
export default LoginModal