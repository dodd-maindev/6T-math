import React from 'react';
import { LogOut } from 'lucide-react';

/**
 * Desktop navigation component with centered menu items and aligned action buttons.
 */
export const DesktopNav = ({ menuItems, user, logout }) => {
  return (
    <div className="hidden lg:flex items-center justify-between flex-1 ml-10">
      {/* Centered Navigation Menu */}
      <nav className="flex items-center justify-center space-x-8 flex-1">
        {menuItems.map((item, index) => (
          <div key={index} className="relative group">
            <a
              href={item.href}
              className="text-slate-800 font-semibold hover:text-pink-500 py-2 transition-colors duration-200
                relative after:content-[''] after:absolute after:left-0 after:bottom-0 text-base sm:text-lg
                after:w-0 after:h-0.5 after:bg-pink-500 after:transition-all after:duration-300
                hover:after:w-full group-hover:text-pink-500"
            >
              {item.title}
            </a>
            {item.submenu && (
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 
                group-hover:visible transition-all duration-200 transform translate-y-2 
                group-hover:translate-y-0 z-50">
                <div className="bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                  {item.submenu.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 
                        hover:text-pink-500 transition-colors duration-200"
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Right Action Buttons */}
      <div className="flex items-center space-x-4 shrink-0">
        <a
          href="https://zalo.me"
          target="_blank"
          rel="noreferrer"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-5 
            rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-center text-sm sm:text-base"
        >
          Tuyển sinh
        </a>
        {user ? (
          <div className="flex items-center space-x-3">
            <a href="/dashboard" className="text-slate-800 font-semibold hover:text-pink-500 text-base transition-colors duration-200">
              Học tập
            </a>
            <button
              onClick={logout}
              className="border border-red-200 hover:bg-red-50 text-red-500 p-2 rounded-full transition-all"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="border border-pink-500 text-pink-500 hover:bg-pink-50 py-2 px-5 
              rounded-full hover:shadow-lg transition-all duration-200 text-center font-medium text-sm sm:text-base"
          >
            Đăng nhập
          </a>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
