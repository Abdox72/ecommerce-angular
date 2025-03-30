import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../interfaces/cart';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
// import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule ,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit ,OnDestroy {
  userCart!: Cart;
  Subtotal:number = 0;
  shippingTotal:number = 0;
  total:number = 0;
  private destroy$ = new Subject<void>();

  constructor(private _cart:CartService , private _toastr :ToastrService) { }

  ngOnInit(): void {
    this.cartInit();
  }
  remove(cartid?:string , productId? : number) {
    this._cart.removeFromCart(cartid??'', productId??0).then((removed) => {
      if(removed) {
        this.cartInit();
        this._toastr.success("Product removed successfully");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  quantityChanged(newValue: any , product:{product:Product , quantity:number}){
    const newQuantity = parseInt(newValue.target.value, 10);
    if (!isNaN(newQuantity)  ){
        this._cart.addToCart(product.product, newQuantity);
    }
  }
  cartInit() {
    this._cart.cart.pipe(takeUntil(this.destroy$)).subscribe(cart => {
      if (cart) {
        this.userCart = cart;
      } else {
        this.userCart = {
          userId: "null",
          products: [{
            product: {
              id: 0,
              title: "null",
              price: 0,
              description: "null",
              category: "null",
              image: "null",
              rating: {
                rate: 0,
                count: 0
              }
            },
            quantity: 0
          }]
        }; // Handle case when cart is null
      }
      let num=0;
      this.userCart?.products?.forEach(
        (product) => {  
          num += (product.product.price * product.quantity)
        }
      );
      this.Subtotal = num;
      this.total = this.Subtotal+this.shippingTotal
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
