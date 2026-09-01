import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Award, Target, Users } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroContent = [
    {
      title: "Câu Lạc Bộ Tư Duy 6T",
      subtitle: "Khám phá tiềm năng - Chinh phục đỉnh cao",
      image: "/api/placeholder/1200/800"
    },
    {
      title: "Phương Pháp Độc Đáo",
      subtitle: "Kết hợp nhiều phương pháp giảng dạy sáng tạo",
      image: "/api/placeholder/1200/800"
    },
    {
      title: "Thành Công Vượt Trội",
      subtitle: "95% học viên đạt kết quả xuất sắc",
      image: "/api/placeholder/1200/800"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroContent.length]);

  const statistics = [
    { icon: Users, value: "1000+", label: "Học viên" },
    { icon: Star, value: "95%", label: "Tỷ lệ đậu" },
    { icon: Award, value: "50+", label: "Giải thưởng" },
    { icon: Target, value: "100%", label: "Cam kết" }
  ];

  return (
    <section className="min-h-screen mt-7 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-40" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 md:py-20 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative inline-block mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 md:-top-8 -left-4 md:-left-8"
              >
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" />
              </motion.div>
              <h1 className="text-4xl h-24 sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient leading-tight px-2 md:px-0">
                {heroContent[currentSlide].title}
              </h1>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 md:-bottom-8 -right-4 md:-right-8"
              >
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" />
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-4 md:px-0"
            >
              {heroContent[currentSlide].subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-8 md:mb-16 px-4"
        >
          <button className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold overflow-hidden w-full sm:w-auto">
            <span className="relative z-10">Đăng Ký Ngay</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              className="absolute inset-0 bg-white opacity-25"
              initial={{ x: '100%' }}
              whileHover={{ x: '-100%' }}
              transition={{ duration: 0.5 }}
            />
          </button>
          <button className="group relative px-6 md:px-8 py-3 md:py-4 border-2 border-purple-600 text-purple-600 rounded-full font-semibold overflow-hidden hover:text-white transition-colors duration-300 w-full sm:w-auto">
            <span className="relative z-10">Tìm Hiểu Thêm</span>
            <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto px-4">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center p-2 md:p-4"
            >
              <div className="flex justify-center mb-2 md:mb-4">
                <stat.icon className="w-8 h-8 md:w-12 md:h-12 text-purple-600" />
              </div>
              <div className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-16 md:bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2">
        {heroContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-purple-600 w-4 md:w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;