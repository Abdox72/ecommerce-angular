import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title'
})
export class TitlePipe implements PipeTransform {

  transform(title: string, ...args: unknown[]): string {
    return title;
  }

}
