import React from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (id: string) => {
    if (location.pathname === '/') {
      scrollToSection(id);
    } else {
      navigate('/');
      setTimeout(() => scrollToSection(id), 100);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => handleNav('home')}>Abell Arora</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button onClick={() => handleNav('home')} className="text-gray-700 hover:text-red-500 transition-colors">Home</button>
            <button onClick={() => handleNav('about')} className="text-gray-700 hover:text-red-500 transition-colors">About</button>
            <button onClick={() => handleNav('gallery')} className="text-gray-700 hover:text-red-500 transition-colors">Gallery</button>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button onClick={() => handleNav('home')} className="text-gray-700 hover:text-red-500 transition-colors">Home</button>
              <button onClick={() => handleNav('about')} className="text-gray-700 hover:text-red-500 transition-colors">About</button>
              <button onClick={() => handleNav('gallery')} className="text-gray-700 hover:text-red-500 transition-colors">Gallery</button>
              <button onClick={() => handleNav('people')} className="text-gray-700 hover:text-red-500 transition-colors">People</button>
              <button onClick={() => handleNav('states')} className="text-gray-700 hover:text-red-500 transition-colors">States</button>
              <button onClick={() => handleNav('disclaimer')} className="text-gray-700 hover:text-red-500 transition-colors">Disclaimer</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;