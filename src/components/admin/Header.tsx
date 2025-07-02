import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="text-2xl font-semibold text-gray-800">{title}</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600">👤</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
