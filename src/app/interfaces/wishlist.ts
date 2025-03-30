import { Product } from "./product";

export interface Wishlist {
    id?: string;
    userId: string;
    products: Product[]
}
