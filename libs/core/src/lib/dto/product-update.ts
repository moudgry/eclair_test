export interface ProductUpdateDTO {
  id?: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  shortDescription: string;
  imageUrl: string;
  gallery?: string[];
  categoryId: string;
  stock: number;
  weight?: number;
  dimensions?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
}
