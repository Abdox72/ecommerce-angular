import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products-service.service';
import { Product } from '../../interfaces/product';
import { ToastrService } from 'ngx-toastr';
import { RatePipe } from '../../pipes/rate.pipe';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
    selector: 'app-product-details',
    imports: [RatePipe , CommonModule],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
    product!:Product;
    constructor(private _activatedRouter:ActivatedRoute ,private _cartService:CartService,private _wishlist:WishlistService ,private _productsService:ProductsService , private _toastrService:ToastrService) { }
    ngOnInit(): void {
        this._activatedRouter.params.subscribe(params => {
            params['id'];
            // Fetch the product details based on the id
            this._productsService.getProductById(params['id'] as number).subscribe({next: (result:Product) => {
                this.product = result;
            } , error: (error) => {
                console.log(error);
                this._toastrService.error('An error occurred while fetching the product details');
            }});
        });
    }
    addtocart(){
        this._cartService.addToCart(this.product, 1).then(() => {
        this._toastrService.success("Product added to cart successfully!");
        }
        ).catch((error) => {
        console.error('Error adding product to cart: ', error);
        });
    }
    addtowishlist(){
        this._wishlist.addWishlist(this.product);
        this._toastrService.success("Product added to wishlist successfully!");
    }
}
