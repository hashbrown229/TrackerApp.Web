import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateDays',
})
export class CalculateDaysPipe implements PipeTransform {
  transform(date: Date): string {
    const currentDate = new Date();
    const providedDate = typeof date === 'string' ? new Date(date) : date;

    const differenceInMs = providedDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

    const postfix = differenceInDays >= 0 ? '' : 'ago';
    const prefix = differenceInDays >= 0 ? 'In' : '';
    const days = Math.abs(differenceInDays);

    return `${prefix} ${days} days ${postfix}`;
  }
}
