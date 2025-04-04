import { Product } from "./product";

export interface Cart {
    id?: string;
    userId?: string;
    products?: [
        {
            product: Product;
            quantity: number;
        }
    ]
}

