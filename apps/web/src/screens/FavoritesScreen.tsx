import React from 'react';
import { Star } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';
import { 
  PageHeader, 
  DocumentCard, 
  EmptyState 
} from '../components/ui';

export const FavoritesScreen: React.FC = () => {
  const { 
    documents, 
    setActiveDocumentDetail, 
    setActiveTab 
  } = useDocumentContext();

  const favoriteDocs = documents.filter(d => d.isFavorite || d.isPriority);

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
  };

  return (
    <div className="w-full space-y-6 select-none max-w-5xl mx-auto">
      
      {/* Header */}
      <PageHeader
        title="Pinned Documents"
        subtitle={`Quick access to your ${favoriteDocs.length} starred vault items`}
      />

      {/* Grid of Starred Documents */}
      {favoriteDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6E6E0] p-8 shadow-xs">
          <EmptyState
            icon={<Star className="w-8 h-8 text-[#F59E0B]" />}
            title="No starred documents yet"
            description="Star important records like passport, driver license, or current insurance policy to access them instantly from here."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {favoriteDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onClick={() => handleOpenDoc(doc)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
