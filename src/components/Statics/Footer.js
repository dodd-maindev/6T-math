import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Clock, Calendar, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-400 rounded-full translate-x-20 translate-y-20" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Contact Information */}
          <div className="space-y-6 backdrop-blur-sm bg-white/30 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-blue-800 border-b-2 border-blue-300 pb-2 flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              Câu lạc bộ Toán học 6T Math
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-gray-600">
                <p>CS1: Nhà 35 - Thượng Dài - Hòa Xá - Ứng Hòa - Hà Nội</p>
                  
                
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <p className="text-gray-600 hover:text-blue-700 cursor-pointer">
                  0397225769
                </p>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <p className="text-gray-600 hover:text-blue-700 cursor-pointer">
                  info@cskh.6Tmathclb.edu.vn
                </p>
              </div>
              <div className="flex items-center space-x-3 group">
                <Clock className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <p className="text-gray-600">
                  Giờ làm việc: 7:30 - 21:00 (T2-CN)
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6 backdrop-blur-sm bg-white/30 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-blue-800 border-b-2 border-blue-300 pb-2">
              Liên Kết Nhanh
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/" className="text-gray-600 hover:text-blue-700 hover:translate-x-2 transition-all duration-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Trang chủ
              </a>
              <a href="/courses" className="text-gray-600 hover:text-blue-700 hover:translate-x-2 transition-all duration-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Khóa học
              </a>
              <a href="/Introduction" className="text-gray-600 hover:text-blue-700 hover:translate-x-2 transition-all duration-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Giới thiệu
              </a>
              <a href="/contact" className="text-gray-600 hover:text-blue-700 hover:translate-x-2 transition-all duration-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Liên hệ
              </a>
            </div>
          </div>

          {/* Column 3: Social Media */}
          <div className="space-y-6 backdrop-blur-sm bg-white/30 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-blue-800 border-b-2 border-blue-300 pb-2">
              Kết Nối Với Chúng Tôi
            </h2>
            <div className="space-y-6">
              <a href="https://www.facebook.com/profile.php?id=100005172408204" target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative overflow-hidden rounded-lg group">
                  <img 
                    src="/Screenshot2025-01-10214336.png"
                    alt="Facebook Page" 
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">Theo dõi chúng tôi trên Facebook</span>
                  </div>
                </div>
              </a>
              <div className="flex justify-center space-x-6">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-125 transition-transform duration-300 hover:-translate-y-1">
                  <Facebook className="w-8 h-8 text-blue-600" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-125 transition-transform duration-300 hover:-translate-y-1">
                  <Youtube className="w-8 h-8 text-red-600" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-125 transition-transform duration-300 hover:-translate-y-1">
                  <Instagram className="w-8 h-8 text-pink-600" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-blue-200">
          <p className="text-center text-gray-600 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            © {new Date().getFullYear()} Bản quyền thuộc về 6T Math Club
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;