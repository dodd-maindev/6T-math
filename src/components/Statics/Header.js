import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { menuItems } from './menuItems';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

/**
 * Main application header managing scroll states, mobile menus, and responsive auth nav.
 */
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSubmenu = (index) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-3 sm:py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between w-full">
            <a href="/" className="shrink-0">
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <img src="/Logo.png" alt="6T Math CLUB" className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover shadow-sm" />
                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                    CLB TƯ DUY 6T
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Khơi nguồn tri thức</p>
                </div>
              </div>
            </a>

            <DesktopNav menuItems={menuItems} user={user} logout={logout} />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors shadow-sm ml-auto"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <MobileNav
        menuItems={menuItems}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        openSubmenuIndex={openSubmenuIndex}
        toggleSubmenu={toggleSubmenu}
        user={user}
        logout={logout}
      />
    </>
  );
};

export default Header;