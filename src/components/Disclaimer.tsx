import React from 'react';

const defaultText = `We are declaring that this website may contain content that is only suitable for persons who are 18 years or older and have the capacity to make independent decisions. Continue with the website only if you are above the age of 18 years, otherwise please leave.`;

const Disclaimer: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <section className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mt-8 mb-4">
    <div className="flex items-start">
      <div className="bg-yellow-100 p-2 rounded-full mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm-6 8v-1a4 4 0 014-4h4a4 4 0 014 4v1" /></svg>
      </div>
      <div>
        <h3 className="text-lg font-bold text-yellow-800 mb-2">DISCLAIMER</h3>
        <p className="text-yellow-700 leading-relaxed">
          {children || defaultText}
        </p>
      </div>
    </div>
  </section>
);

export default Disclaimer; 