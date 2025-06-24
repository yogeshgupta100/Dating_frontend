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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8"> */}
        <div className="col-span-1 flex justify-between gap-4">
          <div className="flex space-x-4">
            <Facebook className="h-5 w-5 text-black-400 hover:text-gray-600 cursor-pointer transition-colors" />
            <Twitter className="h-5 w-5 text-black-400 hover:text-gray-600 cursor-pointer transition-colors" />
            <Instagram className="h-5 w-5 text-black-400 hover:text-gray-600 cursor-pointer transition-colors" />
            {/* </div> */}
          </div>

          <div className="col-span-1 flex gap-4">
            {/* <li><a href="#home" className="text-black-400 hover:text-gray-600 transition-colors">Home</a></li>
              <li><a href="#about" className="text-black-400 hover:text-gray-600 transition-colors">About Us</a></li>
              <li><a href="#services" className="text-black-400 hover:text-gray-600 transition-colors">Services</a></li> */}
            <a
              href="#home"
              className="text-black-400 hover:text-gray-600 transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href="#privacy"
              className="text-black-400 hover:text-gray-600 transition-colors"
            >
              Privacy Policy
            </a>
          </div>

          {/* <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#matching" className="text-black-400 hover:text-gray-600 transition-colors">Profile Matching</a></li>
              <li><a href="#events" className="text-black-400 hover:text-gray-600 transition-colors">Events</a></li>
              <li><a href="#counseling" className="text-black-400 hover:text-gray-600 transition-colors">Relationship Counseling</a></li>
              <li><a href="#premium" className="text-black-400 hover:text-gray-600 transition-colors">Premium Membership</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500" />
                <span className="text-black-400">info@logo.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500" />
                <span className="text-black-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="text-black-400">New Delhi, India</span>
              </div>
            </div>
          </div> */}
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-black-400">© 2025 Logo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
