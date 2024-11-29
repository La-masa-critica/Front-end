import { Profile } from '@app/models/auth-response.model';
import { Sale } from '../app/models/sale.model';

const apiUrl = 'http://localhost:8080/api/v1';

export const environment = {
  production: true,
  apiUrl: apiUrl, // Usar proxy para desarrollo
  itemApiUrl: `${apiUrl}/item`,
  categoryApiUrl: `${apiUrl}/category`,
  cartApiUrl: `${apiUrl}/cart`,
  saleApiUrl: `${apiUrl}/sale`,
  authApiUrl: `${apiUrl}/auth`,
  currentSale: null as Sale | null,
  currtentUser: null as Profile | null,
  role : null as string | null
};
