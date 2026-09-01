import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Mobile navigation component for the header.
 */
export const MobileNav = ({
  menuItems,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  openSubmenuIndex,
  toggleSubmenu,
  user,
  logout
}) => {
  return (
    <div
      className={`lg:hidden fixed top-[105px] left-0 right-0 bg-white shadow-lg 
        transition-all opacity-0 duration-300 z-40 max-h-[calc(100vh-105px)] overflow-y-auto
        ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full'}`}
    >
      <nav className="container mx-auto px-4 py-4">
        {menuItems.map((item, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0">
            <div 
              className="flex items-center justify-between py-3 cursor-pointer"
              onClick={() => item.submenu && toggleSubmenu(index)}
            >
              <a
                href={item.href}
                className="text-lg font-medium text-gray-700 hover:text-pink-500 transition-colors duration-200"
                onClick={(e) => item.submenu && e.preventDefault()}
              >
                {item.title}
              </a>
              {item.submenu && (
                openSubmenuIndex === index ? 
                  <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
            {item.submenu && (
              <div className={`pl-4 space-y-2 overflow-hidden transition-all duration-300
                ${openSubmenuIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                {item.submenu.map((subItem, subIndex) => (
                  <a
                    key={subIndex}
                    href={subItem.href}
                    className="block py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {subItem.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        <a href="https://zalo.me" target="_blank" rel="noreferrer" className="block text-center w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 
          text-white py-3 px-6 rounded-full hover:shadow-lg transition-all duration-200 font-medium">
          Tuyển sinh
        </a>
        {user ? (
          <div className="mt-4 space-y-2">
            <a
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center w-full border border-pink-500 text-pink-500 py-3 px-6 rounded-full font-medium"
            >
              Trang học tập
            </a>
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full border border-red-300 text-red-500 py-3 px-6 rounded-full font-medium"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <a
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-center w-full mt-2 border border-pink-500 text-pink-500 py-3 px-6 rounded-full font-medium"
          >
            Đăng nhập
          </a>
        )}
      </nav>
    </div>
  );
};

export default MobileNav;
