import { Sale } from '../app/models/sale.model';
import { Profile } from '../app/models/auth-response.model';

export const environment = {
  production: false,
  apiUrl: '/api/v1', // Usar proxy para desarrollo
  itemApiUrl: '/api/v1/item',
  categoryApiUrl: '/api/v1/category',
  cartApiUrl: '/api/v1/cart',
  saleApiUrl: '/api/v1/sale',
  authApiUrl: '/api/v1/auth',
  currentSale: null as Sale | null,
  currtentUser: null as Profile | null,
  role: null as string | null,
};
