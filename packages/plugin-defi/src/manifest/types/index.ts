export interface OrderParams {
  quantity: number;
  side: string;
  price: number;
}

export interface BatchOrderPattern {
  side: string;
  totalQuantity?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  spacing?: {
    type: "percentage" | "fixed";
    value: number;
  };
  numberOfOrders?: number;
  individualQuantity?: number;
}
