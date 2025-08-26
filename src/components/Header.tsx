"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const scrollToSection = (id: string) => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  const handleNav = (id: string) => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      // Check if the target section exists on the current page
      const targetElement = document.getElementById(id);

      if (targetElement) {
        // Section exists on current page, scroll to it
        scrollToSection(id);
      }
      // If section doesn't exist, do nothing (no redirect)
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span
              className="text-2xl font-bold text-gray-900 cursor-pointer"
              onClick={() => handleNav("home")}
            >
              Pokkoo
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => handleNav("home")}
              className="text-gray-700 hover:text-red-500 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNav("about")}
              className="text-gray-700 hover:text-red-500 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleNav("gallery")}
              className="text-gray-700 hover:text-red-500 transition-colors"
            >
              Gallery
            </button>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNav("home")}
                className="text-gray-700 hover:text-red-500 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNav("about")}
                className="text-gray-700 hover:text-red-500 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => handleNav("gallery")}
                className="text-gray-700 hover:text-red-500 transition-colors"
              >
                Gallery
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
