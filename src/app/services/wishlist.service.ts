import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Wishlist } from '../interfaces/wishlist';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private _wishlist = new BehaviorSubject<Wishlist|null>(null);

  constructor(private auth:AuthService , private _toastr:ToastrService) {
    this.listenToWishList();
    this.initalizeWishlistFromLocalStorage();
  }

  get wishlist() {
      return this._wishlist.asObservable();
  }
  private initalizeWishlistFromLocalStorage(){
    try{
      this.auth.getCurrentUser().subscribe((user) => {
        if(user){
          let wishlistjson = localStorage.getItem('wishlist');
          if(!!wishlistjson)
          {
            const wishlist:Wishlist = JSON.parse(wishlistjson as string);
            this._wishlist.next(wishlist)
          }else{
            const jsonstr = JSON.stringify({
              userId: user.uid,
              products:[]
            });
            localStorage.setItem('wishlist', jsonstr);
            this._wishlist.next({
              userId: user.uid,
              products:[]
            });
          }
        }
        else{
          console.log('unauthenticated user');
        }
      });
    }catch(error){
      //handle
      console.log(error);
    }
  }
  listenToWishList(){
    this._wishlist.subscribe((wishlist)=>{
      if(wishlist)
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    })
  }
  getfromlocalstorage():Wishlist|null {
    const result  = localStorage.getItem('wishlist');
    if(result) {
      return JSON.parse(result) ;
    }
    else{
      return null; 
    }
  }

  addWishlist(product:Product)
  {
    try{
      const wishlist:Wishlist|null = this.getfromlocalstorage()
      //if  product exist remove it
      if(wishlist)
      {
        const existingProductIndex = wishlist?.products.findIndex(_product => _product.id===product.id);
        if (existingProductIndex !== -1 &&  existingProductIndex!== undefined) {
          this.removeFromwishlist(wishlist.products[existingProductIndex]);
          // this._toastr.success("the Product removed From your Wishlist");
          return;
        }
      }
      //if wishlist and product is not exist in wishlist container >> push it
      //else (not wishlist) intialize one wish userid and the product
      if(wishlist) {
        wishlist.products.push(product);
        this._wishlist.next(wishlist);
        // this._toastr.success("the Product inserted into your Wishlist");
        return;
      }
      else{
        this.auth.getCurrentUser().subscribe(user =>{
          let newwishlist:Wishlist = {
            userId:user?.uid as string,
            products:[product]
          }
          this._wishlist.next(newwishlist);
        })
      }
    }catch(error){
      console.log(error);
    }
  }
  removeFromwishlist(product:Product){
    try {
    const newwishlist = this._wishlist.getValue();
    const index = newwishlist?.products.indexOf(product)??-1;
    if(index!== -1)
    {
      newwishlist?.products.splice(index , 1);
      this._wishlist.next(newwishlist);
      // this._toastr.success("The Product removed form you Wishlist");
    }
    } catch (e) {
      console.error(e);
    }
  }
}
