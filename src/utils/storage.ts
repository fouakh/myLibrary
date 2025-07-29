import { Book } from '../types/Book';

export const exportBooksToJSON = (books: Book[], uploadedImage?: string | null): void => {
  const exportData = {
    books,
    uploadedImage: uploadedImage || null,
    exportDate: new Date().toISOString()
  };
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `my-library-backup-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importBooksFromJSON = (file: File): Promise<{ books: Book[], uploadedImage?: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Handle both old format (just books array) and new format (with image)
        if (Array.isArray(data)) {
          // Old format - just books
          resolve({ books: data });
        } else if (data.books && Array.isArray(data.books)) {
          // New format - with image and metadata
          resolve({ 
            books: data.books, 
            uploadedImage: data.uploadedImage 
          });
        } else {
          reject(new Error('Invalid JSON format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};