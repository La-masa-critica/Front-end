export interface CartItem {
  cartId: number;
  itemId: number;
  quantity: number;
  name?: string;
  price?: number; // Made price optional
}

export interface Cart {
  id: number;
  enabled?: boolean;
  items: CartItem[];
}
