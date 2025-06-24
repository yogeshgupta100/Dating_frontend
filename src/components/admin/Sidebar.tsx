import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../services/api'; // Assuming your api object is in this path
import { toast } from 'react-toastify';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [whatsAppNumber, setWhatsAppNumber] = useState('');

  const menuItems = [
    { path: '/admin/locations', label: 'Locations', icon: '📍' },
    { path: '/admin/models', label: 'Models', icon: '👥' },
    { path: '/admin/faqs', label: 'FAQs', icon: '❓' },
  ];

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const data = await api.getPhoneNumber();
        const phoneNumber = (data as any)?.phone_number;
        if (typeof phoneNumber === 'string') {
          setWhatsAppNumber(phoneNumber);
        }
      } catch (error) {
        console.error('Error fetching phone number:', error);
      }
    };
    fetchNumber();
  }, []);

  const handleSave = async () => {
    try {
      await api.createPhoneNumber(whatsAppNumber);
      toast.success('WhatsApp number saved successfully!');
    } catch (error) {
      console.error('Error saving WhatsApp number:', error);
      toast.error('Failed to save WhatsApp number.');
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${
                    location.pathname === item.path ? 'bg-gray-700' : ''
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* WhatsApp Section */}
      <div className="p-4 border-t border-gray-700 mt-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">🟢</span> WhatsApp
        </h2>
        <label htmlFor="whatsapp-number" className="block text-sm mb-1 text-gray-300">Number</label>
        <input
          id="whatsapp-number"
          type="tel"
          placeholder="Enter WhatsApp number"
          value={whatsAppNumber}
          onChange={(e) => setWhatsAppNumber(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSave}
          className="w-full mt-2 px-3 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Save Number
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 