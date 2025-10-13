export interface CategoryUpdateDTO {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isFeatured: boolean;
  sortOrder: number;
}
