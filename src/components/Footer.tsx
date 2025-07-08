import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#FFB6C1] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
          {/* Social Media Links */}
          <div className="flex space-x-4 order-2 sm:order-1">
            <Facebook className="h-5 w-5 text-black-400 hover:text-gray-600 cursor-pointer transition-colors" />
            <Twitter className="h-5 w-5 text-black-400 hover:text-gray-600 cursor-pointer transition-colors" />
            <Instagram className="h-5 w-5 text-black-400 hover:text-gray-600 cursor-pointer transition-colors" />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 order-1 sm:order-2 text-center sm:text-left">
            <a
              href="#home"
              className="text-black-400 hover:text-gray-600 transition-colors text-sm sm:text-base"
            >
              Terms & Conditions
            </a>
            <a
              href="#privacy"
              className="text-black-400 hover:text-gray-600 transition-colors text-sm sm:text-base"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-black-400 text-sm sm:text-base">
            © 2025 Pokkoo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
