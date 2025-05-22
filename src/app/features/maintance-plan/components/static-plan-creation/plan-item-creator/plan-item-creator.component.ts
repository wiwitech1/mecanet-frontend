import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plan-item-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-item-creator.component.html',
  styleUrls: ['./plan-item-creator.component.scss']
})
export class PlanItemCreatorComponent implements OnInit {

  @Input() itemNameDefault: string = '';
  @Input() maxDays: number = 1;

  itemName: string = '';
  selectedDay: number = 1;

  @Output() saveItem = new EventEmitter<{ name: string; day: number }>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit() {
    this.itemName = this.itemNameDefault;
    this.selectedDay = 1;
  }

  onSave() {
    if (this.itemName.trim() && this.selectedDay >= 1 && this.selectedDay <= this.maxDays) {
      this.saveItem.emit({ name: this.itemName.trim(), day: this.selectedDay });
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  isEditingName = false;

enableEditName() {
  this.isEditingName = true;
  // Opcional: enfocar input al activarse
  setTimeout(() => {
    const input = document.getElementById('itemNameInput');
    input?.focus();
  }, 0);
}

disableEditName() {
  this.isEditingName = false;
}

  
}
