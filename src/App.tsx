import React, { useState, useMemo } from 'react';
import { Book } from './types/Book';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BookCard } from './components/BookCard';
import { BookModal } from './components/BookModal';

function App() {
  const [books, setBooks] = useLocalStorage<Book[]>('my-library-books', []);
  const [uploadedImage, setUploadedImage] = useLocalStorage<string | null>('my-library-image', null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'createdAt'>('title');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((book) =>
        selectedTags.every((tag) => book.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return b.createdAt - a.createdAt;
      }
    });

    return filtered;
  }, [books, searchQuery, selectedTags, sortBy]);

  const handleAddBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    if (isLocked) {
      alert('Library is locked. Please unlock to add books.');
      return;
    }

    if (editingBook) {
      // Update existing book
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === editingBook.id
            ? { ...bookData, id: editingBook.id, createdAt: editingBook.createdAt }
            : book
        )
      );
      setEditingBook(null);
    } else {
      // Add new book
      const newBook: Book = {
        ...bookData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      setBooks((prevBooks) => [...prevBooks, newBook]);
    }
  };

  const handleImportBooks = (importedBooks: Book[]) => {
    if (isLocked) {
      alert('Library is locked. Please unlock to import books.');
      return;
    }

    const confirm = window.confirm(
      `This will replace your current library with ${importedBooks.length} books. Continue?`
    );
    
    if (confirm) {
      setBooks(importedBooks);
    }
  };

  const handleEditBook = (book: Book) => {
    if (isLocked) {
      alert('Library is locked. Please unlock to edit books.');
      return;
    }
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = (bookId: string) => {
    if (isLocked) {
      alert('Library is locked. Please unlock to delete books.');
      return;
    }
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        books={books}
        onImportBooks={handleImportBooks}
        onImageUpload={handleImageUpload}
        uploadedImage={uploadedImage}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isLocked={isLocked}
        onLockToggle={() => setIsLocked(!isLocked)}
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddBook={() => setIsModalOpen(true)}
          bookCount={filteredAndSortedBooks.length}
          isLocked={isLocked}
        />

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Welcome to My Library
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Get started by creating your first book. You can organize your
              reading collection, add notes, and keep track of your favorite books all in one place.
            </p>
            {!isLocked && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <span className="text-lg">+</span>
                Create Your First Book
              </button>
            )}
          </div>
        ) : filteredAndSortedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Books Found
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              No books match your current search criteria. Try adjusting your search terms or selected tags.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
              {!isLocked && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <span className="text-lg">+</span>
                  Add Book
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {filteredAndSortedBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                isLocked={isLocked}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAddBook}
        editingBook={editingBook}
      />
    </div>
  );
}

export default App;