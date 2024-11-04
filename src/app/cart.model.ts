export interface CartItem {
    cartId: number;
    itemId: number;
    quantity: number;
  }
  
  export interface Cart {
    cartId: number;
    items: CartItem[];
  }

  export interface CartItem2 {
    cartId: number;
    itemId: number;
    quantity: number;
    name: string | undefined;
  }
  
   export interface Cart2 {
    cartId: number;
    items: CartItem2[];
  }