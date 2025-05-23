import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-creator',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-creator.component.html',
  styleUrl: './task-creator.component.scss'
})
export class TaskCreatorComponent {
  taskName: string = '';
  taskDescription: string = '';
  machineIdsInput: string = '';

  @Output() taskCreated = new EventEmitter<{
    taskName: string;
    taskDescription: string;
    machineIds: number[];
  }>();

  @Output() cancel = new EventEmitter<void>();

  get machineIds(): number[] {
    return this.machineIdsInput
      .split(',')
      .map(id => +id.trim())
      .filter(n => !isNaN(n));
  }

  onCreate() {
    if (this.taskName.trim()) {
      this.taskCreated.emit({
        taskName: this.taskName.trim(),
        taskDescription: this.taskDescription.trim(),
        machineIds: this.machineIds
      });
    }
  }
}
