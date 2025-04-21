import { Product } from "./product";

export interface Cart {
    id?: string;
    userId?: string;
    products?: CartItem[]
}
interface CartItem{
    product: Product;
    quantity: number;
}