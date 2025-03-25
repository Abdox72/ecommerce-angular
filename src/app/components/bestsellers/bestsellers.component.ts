import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products-service.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-bestsellers',
  imports: [ProductCardComponent,CommonModule],
  templateUrl: './bestsellers.component.html',
  styleUrl: './bestsellers.component.css'
})
export class BestsellersComponent implements OnInit {
  products:Product[]=[];
  constructor(private productsSerivce:ProductsService ) { }

  bayesianAverage(productCount:number , productRate:number , avergeSales:number , avergeRating:number):number{
    console.log(productCount, productRate, avergeSales, avergeRating);
    const adjustedRating = ((avergeRating* avergeSales) + (productRate * productCount) ) / (avergeSales + productCount);
    return adjustedRating;
  }
  ngOnInit(): void {
    this.productsSerivce.getProducts().subscribe({
        next:(productsRes:Product[])=>{
          const totalSales = productsRes.reduce((sum, p) => sum + p.rating.count, 0);
          const totalRatings = productsRes.reduce((sum, p) => sum + p.rating.rate, 0);
          const C = totalSales / productsRes.length ;
          const M = totalRatings/productsRes.length ;
          const bestSellingProducts = productsRes.map((product:Product) => ({
            ...product,
            bayesianScore: this.bayesianAverage(product.rating.count, product.rating.rate, C, M),
          }));

          this.products = bestSellingProducts.sort((a, b) => (b.bayesianScore ?? 0) - (a.bayesianScore ?? 0)).slice(0, 9);
          },
        error:(error)=>{
          console.log(error);
        }
    }
    );
  } 
}