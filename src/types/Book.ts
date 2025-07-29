export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  uploadedImage?: string;
  driveLink: string;
  tags: string[];
  createdAt: number;
}