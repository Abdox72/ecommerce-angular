import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
apiUrl: string = "https://fakestoreapi.com/products";
  constructor(private _httpClient: HttpClient) { }
  getProducts():Observable<any>{
    return this._httpClient.get(this.apiUrl);
  }
  getProductById(id: number):Observable<any>{
    return this._httpClient.get(this.apiUrl+'/'+id);
  }

}
