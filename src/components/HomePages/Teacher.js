import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const descriptionRef = useRef(null);
  const timeoutRef = useRef(null);

  const teachers = [
    {
      name: "Cô Đào Thị Hồng Xuân",
      role: "Chủ nhiệm CLB 6T MATH",
      description: `Từ những ngày học tại trường THPT chuyên Lý Tự Trọng-Cần Thơ, thầy Cần đã đạt được rất nhiều giải thưởng cấp Thành phố cũng như cấp Quốc gia trong suốt 3 năm học và được tuyển thẳng vào Khoa Dược của Đại học Cần Thơ.

      Thầy vẫn luyến tiếc: "Tôi luôn bị dày vò và đã không kiên định với niềm đam mê toán của mình khi chọn học Dược. Vì vậy, tôi đã tự giải tỏa bằng cách dành thời gian rảnh để dạy kèm toán cho các em học sinh.

      Càng dạy, tôi càng thấy đam mê và có duyên với nghề giáo. Tôi nhận ra rằng mình có thể truyền đạt kiến thức một cách dễ hiểu đến học sinh. Điều đó thôi thúc tôi quyết định từ bỏ công việc Dược sĩ để theo đuổi con đường giảng dạy toán học."`,
      image: "https://embargenting.org.vn/wp-content/uploads/anh-gai-anime-1-960x960.jpg",
    },
    {
      name: "Cô Nguyễn Thị Minh Thư",
      role: "Giáo viên chủ nhiệm Toán 12",
      description: `Với hơn 10 năm kinh nghiệm giảng dạy môn Toán tại các trường THPT hàng đầu, cô Minh Thư đã giúp hàng nghìn học sinh đạt kết quả cao trong các kỳ thi quan trọng.

      Phương pháp giảng dạy độc đáo và tận tâm của cô đã truyền cảm hứng cho nhiều thế hệ học sinh yêu thích môn Toán. Cô luôn tìm cách đơn giản hóa những khái niệm phức tạp và tạo môi trường học tập tích cực.`,
      image: "https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/avartar-anime-7.jpg",
    },
    {
      name: "Thầy Trần Văn Hùng",
      role: "Giáo viên Toán cao cấp",
      description: `Thầy Hùng tốt nghiệp thủ khoa Đại học Sư phạm và có bằng Thạc sĩ Toán học. Với phương pháp giảng dạy sáng tạo và hiệu quả, thầy đã giúp nhiều học sinh đạt giải cao trong các kỳ thi học sinh giỏi.

      Thầy luôn tin rằng: "Mỗi học sinh đều có tiềm năng riêng, nhiệm vụ của người thầy là khơi dậy và phát triển tiềm năng đó."`,
      image: "https://storage.googleapis.com/fc-freepik-pro-rev1-eu-static/ai-styles-landings/anime/characters-and-scenes.jpg?h=1280",
    }
  ];

  useEffect(() => {
    const startTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!isScrolling) {
          setCurrentIndex((prev) => (prev + 1) % teachers.length);
        }
      }, 6000);
    };

    startTimer();

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isScrolling, teachers.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutRef.current);
      
      const scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);

      return () => clearTimeout(scrollTimeout);
    };

    const descriptionElement = descriptionRef.current;
    if (descriptionElement) {
      descriptionElement.addEventListener('scroll', handleScroll);
      return () => descriptionElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-158px)] bg-gradient-to-b from-sky-400 to-sky-600 relative overflow-hidden">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full">
          <path 
            fill="#ffffff" 
            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start"
            >
              {/* Text Content */}
              <div className="space-y-4 md:space-y-6">
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold text-white mt-6 md:mt-24"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Đội Ngũ Giảng Viên
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    {teachers[currentIndex].name}
                  </h2>
                  <p className="text-base md:text-lg text-white/90">
                    {teachers[currentIndex].role}
                  </p>
                </motion.div>

                <motion.div
                  ref={descriptionRef}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 
                    max-h-[300px] md:max-h-[400px] overflow-y-auto
                    scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm md:text-base text-white/90 whitespace-pre-line leading-relaxed">
                    {teachers[currentIndex].description}
                  </p>
                </motion.div>
              </div>

              {/* Mobile Image */}
              <motion.div
                className="md:hidden relative mt-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={teachers[currentIndex].image}
                    alt={teachers[currentIndex].name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </motion.div>

              {/* Desktop Image */}
              <motion.div
                className="hidden md:block relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="rounded-2xl sc overflow-hidden mt-20 shadow-2xl">
                  <img
                    src={teachers[currentIndex].image}
                    alt={teachers[currentIndex].name}
                    className="w-full h-160px object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots - Hidden on mobile */}
          <div className="hidden md:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 justify-center gap-3 p-2 rounded-full">
            {teachers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 
                  ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherShowcase;