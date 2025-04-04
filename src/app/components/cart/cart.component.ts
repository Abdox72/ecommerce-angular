import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../interfaces/cart';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import {ICreateOrderRequest, IPayPalConfig , ITransactionItem, NgxPayPalModule} from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  imports: [CommonModule ,RouterLink ,NgxPayPalModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit ,OnDestroy{
  private _userCart: BehaviorSubject<Cart|null> = new BehaviorSubject<Cart|null>(null);
  Subtotal:number = 0;
  shippingTotal:number = 0;
  total:number = 0;
  private destroy$ = new Subject<void>();
  public payPalConfig ? : IPayPalConfig;

  constructor(private _cartService:CartService , private _toastr :ToastrService) { }

  set userCart(userCart: Cart){
    this._userCart.next(userCart);
  }
  get userCart():Observable<Cart|null> {
    return this._userCart.asObservable();
  }
  
  ngOnInit(): void {
    this.cartInit();
    this.initConfig();
  }
  remove(cartid?:string , productId? : number) {
    this._cartService.removeFromCart('', productId ?? 0).then((removed) => {
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
        this._cartService.addToCart(product.product, newQuantity);
    }
  }
  cartInit() {
    this._cartService.cart.pipe(takeUntil(this.destroy$)).subscribe(cart => {
      if (cart) {
        this.userCart = cart;
      } else {
        this.userCart = {
          userId: "null",
          products:undefined
        }; // Handle case when cart is null
      }
      this.userCart.subscribe( cart => {
        let num=0;
        cart?.products?.forEach(
          (product) => {  
            num += (product.product.price * product.quantity)
          }
        );
        this.Subtotal = num;
        this.total = this.Subtotal+this.shippingTotal
      });
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


    private initConfig(): void {
        const currency = 'USD';
        this.userCart.subscribe(cart=>{
          const items_bag = cart?.products?.map(product => {
            return <ITransactionItem> {
              name:product.product.title,
              category: 'PHYSICAL_GOODS',
              quantity: product.quantity.toString(),
              unit_amount:{
                currency_code: currency,
                value: product.product.price.toString(),
              }
            }
          });
          this.payPalConfig = {
              currency: currency,
              clientId: 'AcZhB43Wt6XA6CCppxKmPmYLfGgXTACEbgDclyGZvfZidhIThgzviC9DTGc7gzP3CHxVQlL3CiuT8XqF',
              createOrderOnClient: (data ) => < ICreateOrderRequest > {
                  intent: 'CAPTURE',
                  purchase_units: [{
                      amount: {
                          currency_code: currency,
                          value: `${this.total}`,
                          breakdown: {
                              item_total: {
                                  currency_code: currency,
                                  value: `${this.total}`
                              }
                          }
                      },
                      items: items_bag,

                  }],
                  application_context: {
                    shipping_preference: "NO_SHIPPING",
                    payee_preferred : "UNRESTRICTED"
                }
              },
              advanced: {
                  commit: 'true'
              },
              style: {
                  label: 'paypal',
                  layout: 'vertical'
              },
              onApprove: (data, actions) => {
                  console.log('onApprove - transaction was approved, but not authorized', data, actions);
                  actions.order.get().then((details:any) => {
                      console.log('onApprove - you can get full order details inside onApprove: ', details);
                  });  
              },
              onClientAuthorization: (data) => {
                  console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
              },
              onCancel: (data, actions) => {
                  console.log('OnCancel', data, actions);
              },
              onError: err => {
                  console.log('OnError', err);
              },
              onClick: (data, actions) => {
                  console.log('onClick', data, actions);
              }
          };
        });
    }

}
