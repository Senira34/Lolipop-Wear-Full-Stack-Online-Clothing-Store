import React from 'react'

const footer = () => {
  return (
     <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 bg-slate-900">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div className="md:max-w-96">
          <img src="/src/assets/logo.3.png" alt="Logo" className="h-32 w-auto object-contain brightness-0 invert" />
          <p className="mt-4 text-sm text-gray-400">
            Discover premium clothing collections for men and women. From casual wear to elegant outfits, find everything to elevate your wardrobe with the latest fashion trends.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 mt-2">
          <div>
            <h2 className="font-semibold mb-5 text-white">Company</h2>
            <ul className="text-sm space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/men" className="hover:text-white transition">Men</a></li>
              <li><a href="/women" className="hover:text-white transition">Women</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-white mb-5">Subscribe to our newsletter</h2>
            <div className="text-sm space-y-2">
              <p className="text-gray-400">The latest news, articles, and resources, sent to your inbox weekly.</p>
              <div className="flex items-center gap-2 pt-4">
                <input className="border border-gray-500/30 bg-slate-800 text-white placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2" type="email" placeholder="Enter your email" />
                <button className="bg-blue-600 hover:bg-blue-700 w-24 h-9 text-white rounded transition">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-xs md:text-sm pb-5 text-gray-400">
        Copyright 2025 © Lollipop Wear. All Rights Reserved.
      </p>
    </footer>
    
  )
}

export default footer
