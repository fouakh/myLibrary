import React from 'react';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Book } from '../types/Book';

interface BookCardProps {
  book: Book;
  isLocked: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, isLocked, onEdit, onDelete }) => {
  const handleClick = () => {
    if (book.driveLink) {
      window.open(book.driveLink, '_blank');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(book);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this book?')) {
      onDelete?.(book.id);
    }
  };
  
  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden relative"
    >
      {/* Edit/Delete buttons when unlocked */}
      {!isLocked && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
          <button
            onClick={handleEdit}
            className="bg-black bg-opacity-70 text-white p-1 rounded hover:bg-opacity-90"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 bg-opacity-70 text-white p-1 rounded hover:bg-opacity-90"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <div className="w-16 h-20 bg-blue-200 rounded mx-auto mb-2 flex items-center justify-center">
                <span className="text-blue-600 text-2xl">📚</span>
              </div>
              <p className="text-xs text-blue-600">No Cover</p>
            </div>
          </div>
        )}
        
        {book.driveLink && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black bg-opacity-70 text-white p-1 rounded">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-gray-600 text-xs mb-3">
          {book.author}
        </p>
        
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
            {book.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{book.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};