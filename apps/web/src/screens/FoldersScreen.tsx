import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  Plus, 
  Search, 
  X,
  MoreVertical,
  Trash2,
  Edit2,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentCategory } from '../types';

export const FoldersScreen: React.FC = () => {
  const { 
    documents, 
    folders,
    createFolder,
    deleteFolder,
    setSelectedCategory, 
    setActiveTab 
  } = useDocumentContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderCategory, setNewFolderCategory] = useState<DocumentCategory>('Identity');

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFolderClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('documents');
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), newFolderCategory);
      setNewFolderName('');
      setIsAddOpen(false);
    }
  };

  const handleDeleteFolder = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the folder "${name}"? Documents in this folder will remain in your vault.`)) {
      deleteFolder(id);
    }
  };

  return (
    <div className="w-full space-y-6 select-none pb-8">
      
      {/* 1. Header with Create Folder Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-display">
            Vault Folders
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#78716C] mt-1">
            Organize and categorize your encrypted personal documents.
          </p>
        </div>

        {/* Primary Create Folder Button */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Folder</span>
        </button>
      </div>

      {/* Add Folder Modal Drawer */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          >
            <form
              onSubmit={handleCreateFolder}
              className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0F172A]">Create New Vault Folder</h3>
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Folder Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Tax Returns, Property Deeds"
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Category Association</label>
                <select
                  value={newFolderCategory}
                  onChange={(e) => setNewFolderCategory(e.target.value as any)}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                >
                  <option value="Identity">Identity</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Medical">Medical / Health</option>
                  <option value="Warranty">Warranty & Others</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1D5FF0] text-white font-bold text-xs shadow-card hover:bg-[#0752D9] transition-colors cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search folders..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D5FF0] transition-all shadow-subtle"
        />
      </div>

      {/* 3. Multi-Column Grid of Folder Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredFolders.map((folder, idx) => {
          // Calculate active docs in this category/folder
          const docCount = documents.filter(d => d.category === folder.category || d.category === folder.name).length || folder.documentCount;

          return (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => handleFolderClick(folder.name)}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle hover:shadow-card hover:border-[#1D5FF0]/40 transition-all flex flex-col justify-between min-h-[170px] cursor-pointer group"
            >
              {/* Top row: Tinted Icon Background + Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${folder.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  <Folder className={`w-6 h-6 ${folder.color} fill-current`} />
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleDeleteFolder(e, folder.id, folder.name)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete Folder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom: Folder Name & Document Count */}
              <div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
                  {folder.name}
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-[#64748B]">
                  <span>{docCount} {docCount === 1 ? 'document' : 'documents'}</span>
                  <span className="text-[11px] font-semibold text-[#1D5FF0] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
