import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../interfaces/product';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitlePipe } from '../../pipes/title.pipe';
import { RatePipe } from '../../pipes/rate.pipe';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CommonModule, RatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() productCard!: Product;
  isInWishlist: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private _cartService: CartService,
    private _wishlistService: WishlistService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.updateWishlistStatus();
    // Subscribe to wishlist changes
    this._wishlistService.wishlist
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateWishlistStatus();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateWishlistStatus(): void {
    this.isInWishlist = this._wishlistService.isProductInWishlist(this.productCard.id);
  }

  addtocart() {
    this._cartService.addToCart(this.productCard, 1).then(() => {
      this._toastr.success("Product added to cart successfully!");
    }).catch((error) => {
      console.error('Error adding product to cart: ', error);
      this._toastr.error("Failed to add product to cart");
    });
  }

  toggleWishlist() {
    this._wishlistService.addWishlist(this.productCard);
  }
}
