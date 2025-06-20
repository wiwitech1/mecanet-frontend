import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-execution-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './execution-card.component.html',
  styleUrls: ['./execution-card.component.scss']
})
export class ExecutionCardComponent {
  @Input() machineryName: string = '';
  @Input() tasks: { label: string; completed: boolean }[] = [];
  @Input() observations: string = '';
  @Input() products: { name: string; quantity: number }[] = [];
}
