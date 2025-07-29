import React from 'react';
import { Search, Plus } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddBook: () => void;
  bookCount: number;
  isLocked: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddBook,
  bookCount,
  isLocked
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-sm text-gray-500">{bookCount} books</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
        
        <button
          onClick={onAddBook}
          disabled={isLocked}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            isLocked 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>
    </div>
  );
};