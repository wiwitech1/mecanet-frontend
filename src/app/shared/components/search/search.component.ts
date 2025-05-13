import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, MatIconModule]
})
export class SearchComponent {
  @Input() placeholder: string = 'Buscar...';
  @Input() filters: { label: string; value: string; options: { label: string; value: string }[] }[] = [ ];
  @Input() newLabel: string = '';
  @Input() actionFunction: () => void = () => {}; // Función que se ejecutará al hacer clic

  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<any>();

  searchText: string = '';
  selectedFilters: { [key: string]: string } = {};

  showFilters: boolean = false;

  onSearchChange() {
    this.search.emit(this.searchText);
  }

  onFilterChange() {
    this.filterChange.emit(this.selectedFilters);
  }

  onActionClick() {
    this.actionFunction();
  }
}
