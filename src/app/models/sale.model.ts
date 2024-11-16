export interface SaleDetail {
  id: number;
  itemId: number;
  quantity: number;
  price: number;
}

export interface Sale {
  id: number;
  profileId: number;
  date: string;
  status: string;
  total: number;
  comments: string;
  saleDetails: SaleDetail[];
}
