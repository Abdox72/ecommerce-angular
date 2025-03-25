import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: Product[], filter:string): Product[] {
    return value.filter((product: Product) => product.title.toLowerCase().includes(filter.toLowerCase()) || product.category.toLowerCase().includes(filter.toLowerCase()));
  }
}
