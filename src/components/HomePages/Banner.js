import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Star, Brain, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const images = [
    '/Banner/pexels-francesco-ungaro-1525041.jpg',
    '/Banner/pexels-maxfrancis-2246476.jpg',
    '/Banner/pexels-baskincreativeco-1480807.jpg',
  ];

  const quotes = [
    "Khơi Dậy Đam Mê Toán Học",
    "Phát Triển Tư Duy Sáng Tạo",
    "Định Hình Tương Lai",
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const Snowfall = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-70"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            animation: `snowfall ${Math.random() * 3 + 8}s linear infinite`,
            animationDelay: `-${Math.random() * 5}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes snowfall {
          0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentImageIndex}
          className="absolute inset-0"
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 3, ease: [0.645, 0.045, 0.355, 1] } }}
          exit={{ scale: 1.4, opacity: 0, transition: { duration: 2 } }}
        >
          <img src={images[currentImageIndex]} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-purple-900/50 to-black/70 opacity-80" />
      <Snowfall />

      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <div className="mb-8 relative">
          <Sparkles className="absolute -top-8 -left-8 w-6 h-6 text-yellow-400 animate-spin-slow" />
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} scale-95 mt-5 sm:scale-100 lg:scale-110`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              6T MATH
            </span>
          </h1>
          <Sparkles className="absolute -bottom-8 -right-8 w-6 h-6 text-yellow-400 animate-spin-slow delay-500" />
        </div>

        <AnimatePresence mode="wait">
          <motion.p key={quotes[currentImageIndex]} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.5 }} className="text-2xl md:text-3xl text-center mb-8 font-light">
            {quotes[currentImageIndex]}
          </motion.p>
        </AnimatePresence>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { icon: Brain, text: "Phương pháp độc đáo" },
            { icon: Star, text: "Giảng viên chất lượng" },
            { icon: Award, text: "Thành tích xuất sắc" }
          ].map((feature, index) => (
            <div key={index} className={`flex items-center space-x-2 transform transition-all duration-1000 backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: `${600 + index * 200}ms` }}>
              <feature.icon className="w-6 h-6 text-blue-400" />
              <span className="text-lg">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className={`flex flex-wrap justify-center gap-4 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <a href='/contact'>
            <button className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-100 sm:hover:scale-105 transition-all duration-300 backdrop-blur-sm">
              Đăng Ký Ngay
            </button>
          </a>
          <a href='/Introduction'>
            <button className="px-6 py-2 sm:px-8 sm:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-blue-900 transform hover:scale-100 sm:hover:scale-105 transition-all duration-300 backdrop-blur-sm">
              Tìm Hiểu Thêm
            </button>
          </a>
        </div>

        <ChevronDown 
          className="hidden sm:block absolute ml-[240px] bottom-8 left-1/3 transform -translate-x-1/2 w-12 h-12 text-white animate-bounce cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        />
      </div>
    </section>
  );
};

export default Banner;