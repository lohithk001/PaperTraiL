import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  Plus, 
  Search, 
  X, 
  Trash2, 
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentCategory } from '../types';
import { 
  PageHeader, 
  Button, 
  CategoryIcon, 
  EmptyState,
  ConfirmDialog,
  toast
} from '../components/ui';

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
  const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null);

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
      toast.success('Folder created', `Folder "${newFolderName.trim()}" is ready.`);
      setNewFolderName('');
      setIsAddOpen(false);
    }
  };

  const handleDeleteFolder = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setFolderToDelete({ id, name });
  };

  return (
    <div className="w-full space-y-6 select-none max-w-5xl mx-auto">
      
      {/* 1. Header with Create Folder Button */}
      <PageHeader
        title="Vault Folders"
        subtitle="Organize, inspect and group your encrypted documents into folders"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddOpen(true)}
          >
            Create Folder
          </Button>
        }
      />

      {/* 2. Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#9B9E96] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search folders..."
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-[#E6E6E0] text-xs text-[#20211F] placeholder:text-[#9B9E96] focus:outline-none focus:border-[#1D5FF0] transition-all shadow-xs"
        />
      </div>

      {/* 3. Multi-Column Grid of Folder Cards */}
      {filteredFolders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6E6E0] p-6 shadow-xs">
          <EmptyState
            icon={<FolderOpen className="w-8 h-8" />}
            title="No folders found"
            description="Create a folder or adjust your search filter."
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsAddOpen(true)}
              >
                Create New Folder
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFolders.map((folder, idx) => {
            const docCount = documents.filter(d => d.category === folder.category || d.category === folder.name).length || folder.documentCount;

            return (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => handleFolderClick(folder.name)}
                className="bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xs hover:border-[#CFCFC8] hover:shadow-sm transition-all flex flex-col justify-between min-h-[160px] cursor-pointer group"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <CategoryIcon category={folder.category} size="md" />

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleDeleteFolder(e, folder.id, folder.name)}
                      className="p-1.5 rounded-lg text-[#9B9E96] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                      title="Delete Folder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom row */}
                <div>
                  <h3 className="text-sm font-semibold text-[#20211F] group-hover:text-[#1D5FF0] transition-colors">
                    {folder.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-xs text-[#6B6E66]">
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
      )}

      {/* Add Folder Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
            <motion.form
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onSubmit={handleCreateFolder}
              className="w-full max-w-md bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#20211F]">Create New Folder</h3>
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-lg text-[#9B9E96] hover:text-[#20211F]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6B6E66]">Folder Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Tax Returns, Property Deeds"
                  className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#6B6E66]">Category Association</label>
                <select
                  value={newFolderCategory}
                  onChange={(e) => setNewFolderCategory(e.target.value as any)}
                  className="w-full mt-1.5 h-10 px-3 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                >
                  <option value="Identity">Identity</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Medical">Medical / Health</option>
                  <option value="Warranty">Warranty & Others</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Create Folder
                </Button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Modern In-App Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(folderToDelete)}
        onClose={() => setFolderToDelete(null)}
        onConfirm={() => {
          if (folderToDelete) {
            deleteFolder(folderToDelete.id);
            toast.success('Folder deleted', `Folder "${folderToDelete.name}" was removed. Documents are preserved.`);
            setFolderToDelete(null);
          }
        }}
        title="Delete Folder"
        description={`Are you sure you want to delete the folder "${folderToDelete?.name}"? Documents in this folder will remain safely in your vault.`}
        confirmLabel="Delete Folder"
        variant="danger"
      />

    </div>
  );
};
