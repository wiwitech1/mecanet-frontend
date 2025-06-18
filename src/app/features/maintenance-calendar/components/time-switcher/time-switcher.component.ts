import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-switcher.component.html',
  styleUrl: './time-switcher.component.scss'
})
export class TimeSwitcherComponent {
  @Input() selectedValue: string = 'monthly';
  @Output() valueChange = new EventEmitter<string>();

  options = [
    { label: "Mensual", value: "monthly" },
    { label: "Semanal", value: "semanal" }
  ];

  onValueChange(value: string): void {
    this.selectedValue = value;
    this.valueChange.emit(value);
  }
}
