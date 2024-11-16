import { Category } from './category.model'; // Ahora esto estará disponible
export interface Item {
  id: number;
  name: string;
  price: number;
  stock: number;
  enabled: boolean;
  categoryList: Category[];
}
