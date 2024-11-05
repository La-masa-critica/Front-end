export interface SaleDetail {
    id: number;
    itemId: number;
    quantity: number;
    price: number;
  }
  
  export interface Checkout {
    id: number;
    profileId: number;
    date: string;
    status: string;
    total: number;
    comments: string | null;
    saleDetails: SaleDetail[];
  }