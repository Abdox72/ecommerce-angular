import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'firestoreDate',
  standalone: true
})
export class FirestoreDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: Timestamp | Date | undefined | null, format: string = 'mediumDate'): string | null {
    if (!value) return null;
    
    if (value instanceof Date) {
      return this.datePipe.transform(value, format);
    }
    
    try {
      const date = value.toDate();
      return this.datePipe.transform(date, format);
    } catch (error) {
      console.error('Error converting timestamp:', error);
      return null;
    }
  }
}