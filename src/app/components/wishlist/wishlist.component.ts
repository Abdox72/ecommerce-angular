import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { Wishlist } from '../../interfaces/wishlist';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-wishlist',
  imports: [CommonModule,RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlist!: Wishlist;
  constructor(private wishlistService: WishlistService , private cartService:CartService ,private _toastr:ToastrService){}
  ngOnInit(): void {
      this.wishlistService.wishlist.subscribe((_wishlist: Wishlist|null) => {
        this.wishlist = _wishlist as Wishlist;
      });
      
  }
  removeItemFromWishlist(product:Product){
    this.wishlistService.removeFromwishlist(product)
    this._toastr.success("Wishlist Item removed successfully");
  }
  addtocart(product:Product){
    this.cartService.addToCart(product , 1);
    this.wishlistService.removeFromwishlist(product)
    this._toastr.success("Wishlist Item added to cart successfully");

  }
}
