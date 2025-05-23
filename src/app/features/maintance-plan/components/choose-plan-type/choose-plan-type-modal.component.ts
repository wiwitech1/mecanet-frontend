import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choose-plan-type-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choose-plan-type-modal.component.html',
  styleUrls: ['./choose-plan-type-modal.component.scss']
})
export class ChoosePlanTypeModalComponent {

  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<'dynamic' | 'static'>();

  /** Cierra el modal */
  onClose(): void {
    this.close.emit();
  }

  /** Emite el tipo de plan elegido y cierra */
  selectPlan(type: 'dynamic' | 'static'): void {
    this.select.emit(type);
    this.onClose();
  }
}
