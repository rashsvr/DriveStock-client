import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const MainCarousel = ({ images }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = () => setLoadedCount((prev) => prev + 1);

  useEffect(() => {
    if (loadedCount === images.length) setIsLoaded(true);
  }, [loadedCount, images.length]);

  return (
    <div className="relative w-full h-screen max-h-[100vh] overflow-hidden bg-gradient-to-b from-[#1a2533] via-gray-700 to-black z-10">
      {/* Full-Screen Auto-Sliding Swiper Carousel */}
      <Swiper
        modules={[Autoplay]}
        direction="vertical"
        allowTouchMove={true}
        grabCursor={true}
        autoplay={{
          delay: 800,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="overflow-hidden">
            <div className="relative w-full h-full bg-cover bg-center before:absolute before:inset-0 before:bg-black before:opacity-40 before:z-[1]">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover sm:object-cover md:object-cover lg:object-cover xl:object-cover 2xl:object-cover"
                onLoad={handleImageLoad}
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:px-10">
          <h1 className="text-left font-['Roboto'] font-bold text-white 
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
            lg:max-w-[70%] 
            translate-x-[40%] sm:translate-x-[25%] md:translate-x-[20%] lg:translate-x-[25%]">
            {/* Drive and Stock split into two lines up to md */}
            <span className="block text-[#F97316] md:block lg:inline text-5xl sm:text-6xl md:text-7xl xl:text-9xl 
              drop-shadow-[0_4px_4px_rgba(249,115,22,0.5)] hover:drop-shadow-[0_6px_6px_rgba(249,115,22,0.7)] 
              transition-all duration-300">
              Drive
            </span>
            <span className="block text-[#F97316] md:block lg:inline text-5xl sm:text-6xl md:text-7xl xl:text-9xl 
              drop-shadow-[0_4px_4px_rgba(249,115,22,0.5)] hover:drop-shadow-[0_6px_6px_rgba(249,115,22,0.7)] 
              transition-all duration-300">
              Stock
            </span>
            {/* Tagline with subtle teal accent */}
            <span className="block text-[#F97316]/70 text-sm sm:text-xl md:text-2xl lg:text-lg font-normal 
              mt-2 lg:mt-0 lg:ml-2 drop-shadow-[0_2px_2px_rgba(45,212,191,0.3)]">
              Your <span className="text-[#2DD4BF]">Market</span> Advantage
            </span>
          </h1>
        </div>
      </div>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-30">
          <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"></div>
        </div>
      )}
    </div>
  );
};

export default MainCarousel;