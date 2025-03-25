import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products-service.service';
import { Product} from '../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
@Component({
  selector: 'app-products',
  imports: [ProductCardComponent , CommonModule , FormsModule , FilterPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  productFilter: string = '';
  constructor(private _productService:ProductsService) { }
  
  ngOnInit() {
    this._productService.getProducts().subscribe({
      next: products => {
        this.products = products;
      },
      error: err => console.log(err)
    });
  }
}
