import React from 'react'
import { Link } from 'react-router-dom'
import women from '../assets/women.jpg'
import men from '../assets/men.jpg'

const Category = () => {
  return (
    <section className="py-20 px-4 md:px-16 lg:px-24 xl:px-32 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Men's Category */}
        <div className="relative group overflow-hidden rounded-3xl h-screen">
          <img 
            src={men}
            alt="Men's Collection"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl font-bold text-white mb-6">MEN'S</h2>
            <Link to="/men" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-md transition-all active:scale-95">
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* Women's Category */}
        <div className="relative group overflow-hidden rounded-3xl h-screen">
          <img 
            src={women}
            alt="Women's Collection"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl font-bold text-white mb-6">WOMEN'S</h2>
            <Link to="/women" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-md transition-all active:scale-95">
              SHOP NOW
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Category