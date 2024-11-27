import { Sale } from '../app/models/sale.model';

export const environment = {
  production: false,
  apiUrl: '/api/v1', // Usar proxy para desarrollo
  itemApiUrl: '/api/v1/item',
  categoryApiUrl: '/api/v1/category',
  cartApiUrl: '/api/v1/cart',
  saleApiUrl: '/api/v1/sale',
  currentSale: null as Sale | null,
};
