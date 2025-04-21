import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../interfaces/cart';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../interfaces/product';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem, NgxPayPalModule } from 'ngx-paypal';
import { OrdersService } from '../../services/orders.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { COUNTRIES, Country } from '../../constants/countries';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxPayPalModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  private _userCart: BehaviorSubject<Cart | null> = new BehaviorSubject<Cart | null>(null);
  Subtotal: number = 0;
  shippingTotal: number = 0;
  total: number = 0;
  private destroy$ = new Subject<void>();
  public payPalConfig?: IPayPalConfig;
  shippingForm: FormGroup;
  countries: Country[] = COUNTRIES;

  constructor(
    private _cartService: CartService,
    private _toastr: ToastrService,
    private _ordersService: OrdersService,
    private _router: Router,
    private fb: FormBuilder
  ) {
    this.shippingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      country: ['', [Validators.required]]
    });
  }
  set userCart(userCart: Cart) {
    this._userCart.next(userCart);
  }
  get userCart(): Observable<Cart | null> {
    return this._userCart.asObservable();
  }
  isCartEmpty(): boolean {
    const cart = this._userCart.getValue();
    if (!cart || !cart.products) {
      return true;
    }
    const products = cart.products as Array<{ product: Product; quantity: number }>;
    return products.length === 0;
  }

  ngOnInit(): void {
    this.cartInit();
    this.initConfig();
  }

  remove(productId: number): void {
    this._cartService.removeFromCart(productId).then((removed) => {
      if (removed) {
        this.cartInit();
        this._toastr.success("Product removed successfully");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  async quantityChanged(newValue: any, product: { product: Product, quantity: number }): Promise<void> {
    const newQuantity = parseInt(newValue.target.value, 10);
    if (!isNaN(newQuantity)) {
      await this._cartService.addToCart(product.product, newQuantity, true);
    }
  }

  cartInit(): void {
    this._cartService.cart.pipe(takeUntil(this.destroy$)).subscribe(cart => {
      if (cart) {
        this.userCart = cart;
      } else {
        this.userCart = {
          userId: "null",
          products: undefined
        };
      }
      this.userCart.subscribe(cart => {
        let num = 0;
        cart?.products?.forEach(
          (product) => {
            num += (product.product.price * product.quantity);
          }
        );
        this.Subtotal = num;
        this.total = this.Subtotal + this.shippingTotal;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.shippingForm.valid) {
      this._toastr.success('Shipping information saved');
    } else {
      this._toastr.error('Please fill in all required fields correctly');
    }
  }

  private initConfig(): void {
    const currency = 'USD';
    this.userCart.subscribe(cart => {
      const items_bag = cart?.products?.map(product => {
        return <ITransactionItem>{
          name: product.product.title,
          category: 'PHYSICAL_GOODS',
          quantity: product.quantity.toString(),
          unit_amount: {
            currency_code: currency,
            value: product.product.price.toString(),
          }
        }
      });

      this.payPalConfig = {
        currency: currency,
        clientId: 'AcZhB43Wt6XA6CCppxKmPmYLfGgXTACEbgDclyGZvfZidhIThgzviC9DTGc7gzP3CHxVQlL3CiuT8XqF',
        createOrderOnClient: (data) => <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: currency,
              value: this.total.toFixed(2).toString(),
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: this.Subtotal.toFixed(2).toString()
                },
                shipping: {
                  currency_code: currency,
                  value: this.shippingTotal.toFixed(2).toString()
                }
              }
            },
            items: items_bag,
            shipping: {
              address: {
                address_line_1: this.shippingForm.get('address')?.value,
                admin_area_2: this.shippingForm.get('city')?.value,
                admin_area_1: this.shippingForm.get('state')?.value,
                postal_code: this.shippingForm.get('zipCode')?.value,
                country_code: this.getCountryCode(this.shippingForm.get('country')?.value)
              }
            }
          }]
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
          actions.order.get().then((details: any) => {
            console.log('onApprove - you can get full order details inside onApprove: ', details);
          });
        },
        onClientAuthorization: async (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          if (this.shippingForm.valid && data.payer?.name && data.purchase_units?.[0]?.shipping?.address) {
            try {
              const shippingInfo = {
                name: this.shippingForm.get('name')?.value,
                email: this.shippingForm.get('email')?.value,
                phone: this.shippingForm.get('phone')?.value,
                address: this.shippingForm.get('address')?.value,
                city: this.shippingForm.get('city')?.value,
                state: this.shippingForm.get('state')?.value,
                zipCode: this.shippingForm.get('zipCode')?.value,
                country: this.shippingForm.get('country')?.value
              };
              await this._ordersService.createOrder(shippingInfo);
              // Clear cart after successful order creation
              this._cartService.clearCart();
              this.cartInit();
              this._toastr.success('Order placed successfully!');
              this._router.navigate(['/orders']);
            } catch (error) {
              console.error('Error creating order:', error);
              this._toastr.error('Failed to process order. Please try again.');
            }
          } else {
            this._toastr.error('Failed to process order. Please try again.');
          }
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
          this._toastr.warning('Payment cancelled');
        },
        onError: err => {
          console.log('OnError', err);
          this._toastr.error('Payment failed. Please try again.');
        },
        onClick: (data, actions) => {
          if (!this.shippingForm.valid) {
            this._toastr.error('Please fill in all shipping information correctly');
            return false;
          }
          return true;
        }
      };
    });
  }

  getCountryCode(countryName: string): string {
    const country = this.countries.find(c => c.name === countryName);
    return country ? country.code : '';
  }
}
