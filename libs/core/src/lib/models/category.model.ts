export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}
