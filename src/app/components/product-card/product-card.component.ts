import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces/product';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitlePipe } from '../../pipes/title.pipe';
import { RatePipe } from '../../pipes/rate.pipe';

@Component({
  selector: 'app-product-card',
  imports: [ RouterLink ,CommonModule , RatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() productCard! : Product;
  constructor(){}
}
