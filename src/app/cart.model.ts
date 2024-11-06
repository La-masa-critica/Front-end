export interface CartItem {
    cartId: number;
    itemId: number;
    quantity: number;
    name: string | undefined;
  }
  
  export interface Cart {
    cartId: number;
    items: CartItem[];
  }