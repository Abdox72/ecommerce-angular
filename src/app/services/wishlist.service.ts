import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wishlist } from '../interfaces/wishlist';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private _wishlist = new BehaviorSubject<Wishlist|null>(null);

  constructor(private auth:AuthService, private _toastr:ToastrService) {
    this.listenToWishList();
    this.initalizeWishlistFromLocalStorage();
  }

  get wishlist(): Observable<Wishlist|null> {
    return this._wishlist.asObservable();
  }

  isProductInWishlist(productId: number): boolean {
    const currentWishlist = this._wishlist.getValue();
    return currentWishlist?.products.some(p => p.id === productId) ?? false;
  }

  private initalizeWishlistFromLocalStorage() {
    try {
      this.auth.getCurrentUser().subscribe((user) => {
        if(user) {
          let wishlistjson = localStorage.getItem('wishlist');
          if(!!wishlistjson) {
            const wishlist:Wishlist = JSON.parse(wishlistjson as string);
            this._wishlist.next(wishlist);
          } else {
            const newWishlist: Wishlist = {
              userId: user.uid,
              products: []
            };
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            this._wishlist.next(newWishlist);
          }
        }
      });
    } catch(error) {
      console.error('Error initializing wishlist:', error);
    }
  }

  private listenToWishList() {
    this._wishlist.subscribe((wishlist) => {
      if(wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    });
  }

  addWishlist(product:Product) {
    try {
      const currentWishlist = this._wishlist.getValue();
      
      if(currentWishlist) {
        const existingProductIndex = currentWishlist.products.findIndex(p => p.id === product.id);
        
        if(existingProductIndex !== -1) {
          // Product exists, remove it
          currentWishlist.products.splice(existingProductIndex, 1);
          this._wishlist.next(currentWishlist);
          this._toastr.info("Product removed from wishlist");
          return;
        }
        
        // Product doesn't exist, add it
        currentWishlist.products.push(product);
        this._wishlist.next(currentWishlist);
        this._toastr.success("Product added to wishlist");
      } else {
        // No wishlist exists, create new one
        this.auth.getCurrentUser().subscribe(user => {
          if(user) {
            const newWishlist: Wishlist = {
              userId: user.uid,
              products: [product]
            };
            this._wishlist.next(newWishlist);
            this._toastr.success("Product added to wishlist");
          }
        });
      }
    } catch(error) {
      console.error('Error updating wishlist:', error);
      this._toastr.error("Failed to update wishlist");
    }
  }

  removeFromwishlist(product:Product) {
    try {
      const currentWishlist = this._wishlist.getValue();
      if(currentWishlist) {
        const index = currentWishlist.products.findIndex(p => p.id === product.id);
        if(index !== -1) {
          currentWishlist.products.splice(index, 1);
          this._wishlist.next(currentWishlist);
        }
      }
    } catch(error) {
      console.error('Error removing from wishlist:', error);
      this._toastr.error("Failed to remove from wishlist");
    }
  }
}
