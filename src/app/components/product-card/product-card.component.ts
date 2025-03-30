import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces/product';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitlePipe } from '../../pipes/title.pipe';
import { RatePipe } from '../../pipes/rate.pipe';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [ RouterLink ,CommonModule , RatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() productCard! : Product;
  constructor(private _cartService:CartService , private wishlist :WishlistService , private _toastr:ToastrService){}

  addtocart(){
    this._cartService.addToCart(this.productCard, 1).then(() => {
      this._toastr.success("Product added to cart successfully!");
    }
    ).catch((error) => {
      console.error('Error adding product to cart: ', error);
    });
  }
  addtowishlist(){
    this.wishlist.addWishlist(this.productCard);
    this._toastr.success("Product added to wishlist successfully!");
  }
}
