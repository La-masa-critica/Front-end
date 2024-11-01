export interface CartItem {
    itemId: number;
    quantity: number;
  }
  
  export interface Cart {
    cartId: number;
    items: CartItem[];
  }