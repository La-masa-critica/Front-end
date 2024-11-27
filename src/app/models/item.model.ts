import { Category } from './category.model'; // Ahora esto estará disponible
export interface Item {
  id: number;
  imageUrl?: string;
  description?: string;
  name: string;
  price: number;
  stock: number;
  enabled: boolean;
  categoryList: Category[];
}
