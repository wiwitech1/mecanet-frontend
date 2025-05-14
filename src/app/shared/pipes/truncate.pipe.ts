import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit: number = 100,
    suffix: string = '...',
    preserveWords: boolean = true
  ): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    
    if (preserveWords) {
      let truncatedText = value.substring(0, limit);
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      
      if (lastSpaceIndex !== -1) {
        truncatedText = truncatedText.substring(0, lastSpaceIndex);
      }
      
      return truncatedText + suffix;
    } else {
      return value.substring(0, limit) + suffix;
    }
  }
}