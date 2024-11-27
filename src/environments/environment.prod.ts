import { Sale } from '../app/models/sale.model';

const apiUrl = 'http://localhost:8080/api/v1';

export const environment = {
  production: true,
  apiUrl: apiUrl, // Usar proxy para desarrollo
  itemApiUrl: `${apiUrl}/item`,
  categoryApiUrl: `${apiUrl}/category`,
  cartApiUrl: `${apiUrl}/cart`,
  saleApiUrl: `${apiUrl}/sale`,
  currentSale: null as Sale | null,
};
