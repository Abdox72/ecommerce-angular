import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rate'
})
export class RatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    let rate = Math.round(parseFloat(value));
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      
      if (i <= rate) {
        stars += '★';
      } 
      else {
        stars += '☆';
      }
    }
    return stars;
  }


}
