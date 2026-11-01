import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  GraduationCap, 
  CreditCard, 
  Shield, 
  Heart, 
  FileText, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentCategory } from '../types';

export const CategoriesScreen: React.FC = () => {
  const { documents, setSelectedCategory, setActiveTab } = useDocumentContext();

  const categoriesData: Array<{
    category: DocumentCategory;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    border: string;
  }> = [
    {
      category: 'Identity',
      title: 'Identity & Legal',
      description: 'Passports, National IDs, PAN, Driving Licenses and Citizenship records.',
      icon: FileCheck,
      color: 'text-[#1D5FF0]',
      bg: 'bg-[#EAF1FF]',
      border: 'hover:border-[#1D5FF0]/40',
    },
    {
      category: 'Education',
      title: 'Education & Academics',
      description: 'University marksheets, degrees, transcripts, diplomas and test certificates.',
      icon: GraduationCap,
      color: 'text-[#7C3AED]',
      bg: 'bg-[#F0EAFE]',
      border: 'hover:border-[#7C3AED]/40',
    },
    {
      category: 'Finance',
      title: 'Finance & Banking',
      description: 'Salary slips, bank account statements, tax returns (Form 16) and investments.',
      icon: CreditCard,
      color: 'text-[#27A879]',
      bg: 'bg-[#E8F6EF]',
      border: 'hover:border-[#27A879]/40',
    },
    {
      category: 'Insurance',
      title: 'Insurance Policies',
      description: 'Vehicle motor cover, health insurance policies, life policies and claims.',
      icon: Shield,
      color: 'text-[#F5A623]',
      bg: 'bg-[#FFF2E6]',
      border: 'hover:border-[#F5A623]/40',
    },
    {
      category: 'Medical',
      title: 'Health & Medical',
      description: 'Diagnostic lab reports, immunization records, prescriptions and hospital records.',
      icon: Heart,
      color: 'text-[#E11D48]',
      bg: 'bg-[#FCECF3]',
      border: 'hover:border-[#E11D48]/40',
    },
    {
      category: 'Warranty',
      title: 'Warranty & Assets',
      description: 'Gadget warranties, product receipts, appliance guarantees and purchase proof.',
      icon: FileText,
      color: 'text-[#64748B]',
      bg: 'bg-[#F0F2F6]',
      border: 'hover:border-slate-400',
    },
  ];

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    setActiveTab('documents');
  };

  return (
    <div className="w-full space-y-6 select-none pb-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-display">
          Document Categories
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#78716C] mt-1">
          Explore and filter your personal document vault by thematic categories.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoriesData.map((item, idx) => {
          const Icon = item.icon;
          const count = documents.filter(d => d.category === item.category).length;

          return (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => handleSelect(item.category)}
              className={`bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-subtle hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between ${item.border}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-6 h-6 ${item.color} stroke-[2.2]`} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7F9FC] text-[#0F172A] border border-[#E2E8F0]">
                    {count} {count === 1 ? 'doc' : 'docs'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
                <span>Browse Documents</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
