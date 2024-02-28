import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORY } from '../../models';

@Pipe({
  name: 'categoryToString',
})
export class CategoryToStringPipe implements PipeTransform {
  transform(value: number): string {
    // Check if the value is a valid index of the enum
    if (isNaN(value) || value < 0) {
      return 'Unknown'; // Return a default value or handle invalid indexes
    }
    const categoryArray = CATEGORY[value];
    // Convert the index to the enum name
    return categoryArray.replace('_', ' ');
  }
}
