import React, { useState, useEffect } from 'react';
import { FaqFormProps, Faq } from '../../services';

const FaqForm: React.FC<FaqFormProps> = ({ faq, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Faq, 'id'>>({
    name: ''
  });
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (faq) {
      const { id, ...faqData } = faq;
      setFormData(faqData);
    }
  }, [faq]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, id: faq?.id || 0 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '' });
    setIsFocused(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {faq ? 'Edit FAQ' : 'Create New FAQ'}
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          {faq ? 'Update the FAQ information below' : 'Add a new frequently asked question'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FAQ Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter FAQ name..."
              className={`
                w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ease-in-out
                ${isFocused 
                  ? 'border-indigo-500 ring-4 ring-indigo-100 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                focus:outline-none focus:ring-4 focus:ring-indigo-100
                placeholder-gray-400 text-gray-900
              `}
              required
            />
            <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-opacity duration-200 ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
              <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {formData.name && (
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formData.name.length} characters
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="
              px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 
              hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="
              px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium
              hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              transform hover:scale-105 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            "
          >
            <span className="flex items-center">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {faq ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {faq ? 'Update FAQ' : 'Create FAQ'}
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FaqForm; 