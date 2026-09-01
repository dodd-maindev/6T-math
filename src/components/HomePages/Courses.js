import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CourseCard = ({ title, description, color, id }) => {
  return (
    <Link to={`/course/${id}`} className="block outline-none h-[90%] m-4">
      <motion.div
        whileHover={{ 
          scale: 1.03,
          y: -8,
          transition: { duration: 0.2 }
        }}
        className="h-full"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div
          className={`${color} p-8 rounded-3xl shadow-xl h-full mx-2 flex flex-col justify-between
          backdrop-blur-lg bg-opacity-95 border border-white/30 
          hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
        >
          <div className="space-y-6 relative z-10">
            <div className="space-y-4">
              <h3 
                className="text-white font-bold text-2xl tracking-wide leading-tight"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                {title}
              </h3>
              <p 
                className="text-white/90 text-base leading-relaxed"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                {description}
              </p>
            </div>

            <div 
              className="flex flex-wrap gap-4 mt-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                <BookOpen className="w-4 h-4 text-white" />
                <span className="text-white text-sm">12 bài học</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                <Users className="w-4 h-4 text-white" />
                <span className="text-white text-sm">200+ học viên</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white text-sm">24 giờ</span>
              </div>
            </div>
          </div>
          
          <div 
            className="mt-8 flex items-center justify-between relative z-10"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <motion.div 
              className="bg-white hover:bg-white/90 px-6 py-3 rounded-2xl group transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`${color.replace('bg-gradient-to-br', 'text')} font-semibold`}>
                Xem chi tiết
              </span>
            </motion.div>
            <motion.div 
              className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center
              backdrop-blur-lg hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="text-white w-6 h-6" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const CourseCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getInitialVisibleCount());
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  

  const courses = [
    {
      title: "ÔN LUYỆN THI TOÁN LỚP 12",
      description: "Khóa học Toán nâng cao lớp 12 dành cho các học sinh nhằm nâng cao điểm số, dạng bài tập nâng cao.",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      id: 12,
    },
    {
      title: "ÔN LUYỆN THI TOÁN LỚP 11",
      description: "Toán chuyên lớp 11 với các chuyên đề trọng tâm, giúp học sinh phát triển tư duy và kỹ năng giải toán.",
      color: "bg-gradient-to-br from-amber-400 to-amber-600",
      id: 11,
    },
    {
      title: "ÔN LUYỆN THI TOÁN LỚP 10",
      description: "Khóa học chuyên sâu với phương pháp giảng dạy hiện đại, tập trung vào việc rèn luyện kỹ năng giải toán.",
      color: "bg-gradient-to-br from-rose-400 to-rose-600",
      id: 10,
    },
    {
      title: "ÔN LUYỆN THI TOÁN LỚP 9",
      description: "Chương trình toán chất lượng cao, giúp học sinh chuẩn bị tốt cho kỳ thi vào lớp 10 với độ khó tăng dần.",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      id: 9,
    },
    {
      title: "ÔN LUYỆN THI TOÁN LỚP 8",
      description: "Khóa học tập trung vào các chuyên đề quan trọng, giúp học sinh xây dựng nền tảng vững chắc.",
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      id: 8,
    },
    {
      title: "ÔN LUYỆN THI TOÁN LỚP 7",
      description: "Chương trình học với phương pháp tiếp cận mới, giúp học sinh phát triển tư duy logic và sáng tạo.",
      color: "bg-gradient-to-br from-red-400 to-red-600",
      id: 7,
    }
  ];

  function getInitialVisibleCount() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      if (window.innerWidth < 1536) return 3;
      return 4;
    }
    return 4;
  }

  useEffect(() => {
    const handleResize = () => {
      const newVisibleCount = getInitialVisibleCount();
      setVisibleCount(newVisibleCount);
      setCurrentIndex(prev => 
        Math.min(prev, Math.max(0, courses.length - newVisibleCount))
      );
      
      const container = document.querySelector('.carousel-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
      AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
        offset: 50
      });
      AOS.refresh();
    };
    

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [courses.length]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeft(currentIndex);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();
    const x = e.touches[0].pageX;
    const walk = (startX - x) / (containerWidth / visibleCount);
    const newIndex = scrollLeft + walk;

    // Prevent scrolling beyond boundaries with smooth resistance
    if (newIndex < 0) {
      setCurrentIndex(0);
    } else if (newIndex > courses.length - visibleCount) {
      setCurrentIndex(courses.length - visibleCount);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Snap to nearest index
    const newIndex = Math.round(currentIndex);
    setCurrentIndex(Math.max(0, Math.min(newIndex, courses.length - visibleCount)));
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < courses.length - visibleCount;

  const nextSlide = () => {
    if (canScrollRight) {
      setCurrentIndex(prev => Math.min(prev + 1, courses.length - visibleCount));
    }
  };

  const prevSlide = () => {
    if (canScrollLeft) {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const slideWidth = containerWidth / visibleCount;

  return (
    <div 
      className="w-full scale-90 max-w-[1536px] mx-auto px-6 py-16 mt-16"
      data-aos="fade-up"
    >
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          disabled={!canScrollLeft}
          className={`absolute -left-4 md:-left-8 top-1/2 opacity-90 -translate-y-1/2 z-10 
          ${canScrollLeft ? 'bg-white/90 hover:bg-white cursor-pointer scale-95' : 'bg-gray-100 cursor-not-allowed'}
          p-3 md:p-5 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transform-gpu
          backdrop-blur-sm border border-gray-100 transition-all duration-300
          md:block hidden`}
          data-aos="fade-right"
        >
          <ChevronLeft size={28} className={canScrollLeft ? 'text-gray-700' : 'text-gray-400'} />
        </motion.button>

        <div 
          className="overflow-hidden carousel-container touch-pan-y"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div 
            className="flex"
            animate={{ 
              x: -currentIndex * slideWidth
            }}
            transition={{ 
              type: "spring",
              stiffness: 150,
              damping: 20
            }}
            style={{
              gap: '0rem',
              touchAction: 'pan-y pinch-zoom'
            }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="flex-none"
                style={{
                  width: `${100/visibleCount}%`,
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CourseCard {...course} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          disabled={!canScrollRight}
          className={`absolute -right-4 md:-right-8 top-1/2 opacity-90 -translate-y-1/2 z-10 
          ${canScrollRight ? 'bg-white/90 hover:bg-white cursor-pointer' : 'bg-gray-100 cursor-not-allowed'}
          p-3 md:p-5 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transform-gpu
          backdrop-blur-sm border border-gray-100 transition-all duration-300
          md:block hidden`}
          data-aos="fade-left"
        >
          <ChevronRight size={28} className={canScrollRight ? 'text-gray-700' : 'text-gray-400'} />
        </motion.button>
      </div>
    </div>
  );
};

export default CourseCarousel;