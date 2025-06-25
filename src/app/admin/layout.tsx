'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import admin components to prevent SSR issues
const AdminSidebar = dynamic(() => import('../../components/admin/Sidebar'), {
  ssr: false,
});

// Admin layout with sidebar and secret code protection
const ADMIN_SECRET = 'mySuperSecretCode123'; // Change this to your desired secret

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const code = localStorage.getItem('admin_secret_code');
      if (code === ADMIN_SECRET) {
        setAuthorized(true);
      } else {
        setShowPrompt(true);
      }
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
      <Suspense fallback={<div>Loading...</div>}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1">{children}</div>
    </div>
  );
} 