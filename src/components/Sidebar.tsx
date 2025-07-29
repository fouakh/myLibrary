import React, { useRef } from 'react';
import { Upload, Download, Lock, Unlock, Filter, SortAsc } from 'lucide-react';
import { Book } from '../types/Book';
import { exportBooksToJSON, importBooksFromJSON } from '../utils/storage';

interface SidebarProps {
  books: Book[];
  onImportBooks: (books: Book[]) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  sortBy: 'title' | 'createdAt';
  onSortChange: (sort: 'title' | 'createdAt') => void;
  isLocked: boolean;
  onLockToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  books,
  onImportBooks,
  selectedTags,
  onTagsChange,
  sortBy,
  onSortChange,
  isLocked,
  onLockToggle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTags = Array.from(new Set(books.flatMap(book => book.tags))).sort();

  const handleExport = () => {
    exportBooksToJSON(books, null); // No uploadedImage
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { books: importedBooks } = await importBooksFromJSON(file);
        onImportBooks(importedBooks);
      } catch (error) {
        alert('Error importing books. Please check the file format.');
      }
    }
    event.target.value = '';
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 space-y-6">
      {/* Library Title */}
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Library
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-2 rounded-full"></div>
        </div>
      </div>

      {/* Lock Status */}
      <div className={`p-4 rounded-lg ${isLocked ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
        <button
          onClick={onLockToggle}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            {isLocked ? (
              <Lock className="w-4 h-4 text-red-600" />
            ) : (
              <Unlock className="w-4 h-4 text-green-600" />
            )}
            <span className={`text-sm font-medium ${isLocked ? 'text-red-700' : 'text-green-700'}`}>
              {isLocked ? 'Locked' : 'Unlocked'}
            </span>
          </div>
        </button>
        <p className={`text-xs mt-1 ${isLocked ? 'text-red-600' : 'text-green-600'}`}>
          {isLocked ? 'Modifications blocked' : 'Modifications allowed'}
        </p>
      </div>

      {/* Backup & Restore */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Backup & Restore</h3>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Import JSON
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Export your books to backup or import from a previous backup
        </p>
      </div>

      {/* Sort Options */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <SortAsc className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">Sort</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => onSortChange('title')}
            className={`w-full px-3 py-2 text-sm rounded-md transition-all ${
              sortBy === 'title'
                ? 'bg-white text-gray-900 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Title
          </button>
          <button
            onClick={() => onSortChange('createdAt')}
            className={`w-full px-3 py-2 text-sm rounded-md transition-all ${
              sortBy === 'createdAt'
                ? 'bg-white text-gray-900 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recent
          </button>
        </div>
      </div>

      {/* Filter by Tag */}
      {allTags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Tags</h3>
            {selectedTags.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {selectedTags.length}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <span className="truncate max-w-20">
                  {tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};