import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products-service.service';
import { Product } from '../../interfaces/product';
import { ToastrService } from 'ngx-toastr';
import { RatePipe } from '../../pipes/rate.pipe';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-product-details',
    imports: [RatePipe, CommonModule],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    product!: Product;
    isInWishlist: boolean = false;
    private destroy$ = new Subject<void>();

    constructor(
        private _activatedRouter: ActivatedRoute,
        private _cartService: CartService,
        private _wishlistService: WishlistService,
        private _productsService: ProductsService,
        private _toastrService: ToastrService
    ) {}

    ngOnInit(): void {
        this._activatedRouter.params.subscribe(params => {
            const productId = params['id'];
            this._productsService.getProductById(productId as number).subscribe({
                next: (result: Product) => {
                    this.product = result;
                    this.updateWishlistStatus();
                    // Subscribe to wishlist changes
                    this._wishlistService.wishlist
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(() => {
                            this.updateWishlistStatus();
                        });
                },
                error: (error) => {
                    console.error(error);
                    this._toastrService.error('An error occurred while fetching the product details');
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateWishlistStatus(): void {
        this.isInWishlist = this._wishlistService.isProductInWishlist(this.product.id);
    }

    addtocart() {
        this._cartService.addToCart(this.product, 1).then(() => {
            this._toastrService.success("Product added to cart successfully!");
        }).catch((error) => {
            console.error('Error adding product to cart: ', error);
            this._toastrService.error("Failed to add product to cart");
        });
    }

    toggleWishlist() {
        this._wishlistService.addWishlist(this.product);
    }
}
