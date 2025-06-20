import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, MatIconModule, TranslateModule]
})
export class SearchComponent {
  @Input() placeholder: string = 'search.placeholder';
  @Input() filters: { label: string; value: string; options: { label: string; value: string }[] }[] = [ ];
  @Input() newLabel: string = 'search.defaultNewLabel';
  @Input() actionFunction: () => void = () => {}; // Función que se ejecutará al hacer clic

  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<any>();

  searchText: string = '';
  selectedFilters: { [key: string]: string } = {};

  showFilters: boolean = false;

  constructor(private translate: TranslateService) {}

  onSearchChange() {
    this.search.emit(this.searchText);
  }

  onFilterChange() {
    this.filterChange.emit(this.selectedFilters);
  }

  onActionClick() {
    this.actionFunction();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  onNewClick(): void {
    this.actionFunction();
  }
}
