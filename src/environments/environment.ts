import { Sale } from "../app/sale.model";

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api/v1',
  itemApiUrl: 'http://localhost:8082/api/v1/item',
  categoryApiUrl: 'http://localhost:8082/api/v1/category',
  cartApiUrl: 'http://localhost:8081/api/v1/cart',
  saleApiUrl: 'http://localhost:8081/api/v1/sale',
  currentSale: null as Sale | null,
};
