import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Sidebar from './components/admin/Sidebar';
import Locations from './pages/admin/Locations';
import Models from './pages/admin/Models';
import Faqs from './pages/admin/Faqs';
import DatingP1 from './pages/DatingP1';
import DatingP2 from './pages/DatingP2';
import DatingP3 from './pages/DatingP3';
import Footer from './components/Footer';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';

// Admin layout with sidebar and secret code protection
const ADMIN_SECRET = 'mySuperSecretCode123'; // Change this to your desired secret

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authorized, setAuthorized] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const code = localStorage.getItem('admin_secret_code');
    if (code === ADMIN_SECRET) {
      setAuthorized(true);
    } else {
      setShowPrompt(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_SECRET) {
      localStorage.setItem('admin_secret_code', ADMIN_SECRET);
      setAuthorized(true);
      setShowPrompt(false);
      setError('');
    } else {
      setError('Incorrect code. Access denied.');
    }
  };

  if (showPrompt && !authorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md flex flex-col gap-4 min-w-[320px]">
          <h2 className="text-xl font-bold mb-2">Admin Access Restricted</h2>
          <label htmlFor="admin-code" className="text-sm">Enter Secret Code:</label>
          <input
            id="admin-code"
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border rounded px-3 py-2"
            autoFocus
            autoComplete="off"
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Access Admin</button>
        </form>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return isAdminRoute ? (
    <AdminLayout>
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/locations" replace />} />
        <Route path="/admin/locations" element={<Locations />} />
        <Route path="/admin/models" element={<Models />} />
        <Route path="/admin/faqs" element={<Faqs />} />
      </Routes>
    </AdminLayout>
  ) : (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<DatingP1 />} />
        <Route path=":locationSlug" element={<DatingP2 />} />
        <Route path=":locationSlug/:modelSlug" element={<DatingP3 />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <ToastContainer />
        <AppRoutes />
      </Router>
    </HelmetProvider>
  );
};

export default App;