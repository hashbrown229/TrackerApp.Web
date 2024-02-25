import { Pipe, PipeTransform } from '@angular/core';
import { PRIORITY } from '../../models';

@Pipe({
  name: 'priorityToString',
})
export class PriorityToStringPipe implements PipeTransform {
  transform(value: number): string {
    // Check if the value is a valid index of the enum
    if (isNaN(value) || value < 0) {
      return 'Unknown'; // Return a default value or handle invalid indexes
    }
    // const priorityArray = PRIORITY[value];
    // Convert the index to the enum name
    return PRIORITY[value];
  }
}
