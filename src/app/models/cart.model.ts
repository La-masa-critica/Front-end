export interface CartItem {
  itemId: number;
  quantity: number;
  name?: string;
  price?: number;
  imageUrl?: string;
}

export interface Cart {
  id: number;
  enabled: boolean;
  items: CartItem[];
}
