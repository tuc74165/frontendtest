import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], filterValue: string): any {
        if (!items || !filterValue) {
            return items;
        }
        return items.filter(item => item['Group Number'] === filterValue);
    }
}
