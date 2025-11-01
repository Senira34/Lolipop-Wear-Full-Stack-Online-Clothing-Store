import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import img1 from '../assets/img1.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'
import img4 from '../assets/img4.jpg'

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const carouselImages = [img1, img2, img3, img4]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  // }

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  // }

  return (
    <section className="flex flex-col max-md:gap-20 md:flex-row pb-20 items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 bg-linear-to-r from-indigo-50 to-purple-50">
      <div className="flex flex-col items-center md:items-start md:flex-1">
         <div className="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-indigo-300 bg-white text-slate-800 text-xs">
          <div className="flex items-center">
            <img className="size-7 rounded-full border-3 border-indigo-500"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />
            <img className="size-7 rounded-full border-3 border-indigo-500 -translate-x-2"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
            <img className="size-7 rounded-full border-3 border-indigo-500 -translate-x-4"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
              alt="userImage3" />
          </div>
          <p className="-translate-x-2">Trusted by 500K+ fashion lovers </p>
        </div> 
        <h1 className="text-center md:text-left text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-bold max-w-xl text-slate-900">
          Fashion that defines your style.
        </h1>
        <p className="text-center md:text-left text-sm text-slate-600 max-w-lg mt-2">
          Explore premium clothing collections for men and women. From casual wear to elegant outfits, find everything to elevate your wardrobe with the latest fashion trends.
        </p>
        <div className="flex items-center gap-4 mt-8 text-sm">
          <Link to="/men"><button className="bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 rounded-md px-7 h-11 ">
            Shop now
          </button></Link>
        </div>
      </div>
      
      {/* Image Carousel */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl md:ml-8 lg:ml-12 mt-7 ">
        <div className="overflow-hidden rounded-2xl shadow-2xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Fashion clothing ${index + 1}`} 
                className="h-140 w-full object-cover shrink-0 "
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-3 transition active:scale-95"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-3 transition active:scale-95"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button> */}

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-white w-10' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
