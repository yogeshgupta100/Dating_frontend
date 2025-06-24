import React, { useState, useEffect } from 'react';
import Header from '../../components/admin/Header';
import FaqForm from '../../components/admin/FaqForm';
import { api } from '../../services/api';
import { Faq } from '../../services';

const Faqs: React.FC = () => {
  const [faq, setFaq] = useState<Faq | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const data = await api.getFaqs();
      // Since we only want one FAQ, take the first one if it exists
      const singleFaq = Array.isArray(data) && data.length > 0 ? data[0] : undefined;
      setFaq(singleFaq);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: Faq) => {
    try {
      // Always call createFaq API, even when updating
      await api.createFaq(formData);
      fetchFaq(); // Refresh the FAQ data
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="FAQ" />
        <main className="pt-20 pl-64">
          <div className="p-6">
            <div className="text-center">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="FAQ" />
      
      <main className="pt-20 pl-64">
        <div className="p-6">

          <div className="max-w-2xl">
            <FaqForm
              faq={faq}
              onSubmit={handleSubmit}
              onCancel={() => {
                // Since we're always showing the form, cancel just refreshes the data
                fetchFaq();
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Faqs; 