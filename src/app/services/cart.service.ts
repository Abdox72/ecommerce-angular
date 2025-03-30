import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../interfaces/cart';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product';

@Injectable({
providedIn: 'root'
})
export class CartService {
    private _cart = new BehaviorSubject<Cart|null>(null);
    constructor( private _firestore:FirestoreService , private _auth:AuthService) {
        this.getCurrentUserCart();
    }
    get cart(): Observable<Cart|null> {
        return this._cart.asObservable();
    }
    set cart(cart: Cart|null) {
        this._cart.next(cart);
    }
    async getCurrentUserCart(): Promise<void> {
        this._auth.getCurrentUser().subscribe( async (user) => {
            if (user) {
                const carts = await this._firestore.queryData('carts', 'userId', '==', user.uid);
                if (carts.length > 0) {
                    this.cart = carts[0]; // Assuming you want the first cart
                } else {
                    this.cart = null; // No cart found for the user
                }
            } else {
                this.cart = null; // User not authenticated
            }
        });
    }
    async addToCart(product: Product, quantity: number): Promise<void> {
        const currentCart = this._cart.getValue();
        if(!currentCart) {
            this._auth.getCurrentUser().subscribe(async user => {
                if (user) {
                    const newCart: Cart = {
                        userId: user.uid,
                        products: [{ product, quantity }]
                    };
                    const cartId = await this._firestore.addData('carts', newCart);
                    if (cartId) {
                        newCart.id = cartId; // Set the ID after adding to Firestore
                        this.cart = newCart; // Update the cart observable
                    }
                }
            });
        }else{
            const existingProductIndex = currentCart.products.findIndex(_product => _product.product.id===product.id);
            if (existingProductIndex !== -1) {
                // Update quantity if product already exists in cart
                currentCart.products[existingProductIndex].quantity = quantity;
            } else {
                // Add new product to cart
                currentCart.products.push({ product, quantity });
            }
            await this._firestore.updateDocument('carts', currentCart.id??'', currentCart);
            this.cart = currentCart; // Update the cart observable
        }
    }
    async removeFromCart(cartID:string, productId:number):Promise<boolean> {
        const currentCart = this._cart.getValue();
        if(currentCart){
            const existingProductIndex = currentCart.products.findIndex(_product => _product.product.id===productId);
            if (existingProductIndex !== -1) {
                //delete currentCart.products[existingProductIndex]
                currentCart.products.splice(existingProductIndex, 1);
            }
            await this._firestore.updateDocument('carts', currentCart.id??'', currentCart);
            this.cart = currentCart; // Update the cart observable
            return true;
        }
        return false;
    }

}

