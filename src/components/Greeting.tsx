import React from 'react';
import { useDocumentContext } from '../context/DocumentContext';

export const Greeting: React.FC = () => {
  const { userProfile } = useDocumentContext();
  const firstName = userProfile.name.split(' ')[0] || 'Lohith';

  return (
    <section className="px-6 pt-2 pb-5">
      <h1 className="text-[28px] sm:text-[32px] font-extrabold text-charcoal-900 tracking-tight leading-[1.18]">
        HI {firstName.toUpperCase()}, nice to
        <br />
        <span className="text-charcoal-700">see you!</span>
      </h1>
      <p className="text-[13.5px] font-medium text-charcoal-500 mt-1.5">
        Your documents are safe with us!
      </p>
    </section>
  );
};
