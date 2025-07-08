import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TranslateModule } from '@ngx-translate/core';

interface AddStockDto {
  quantity: number;
  reason: string;
  unitCost: number;
  reference: string;
}

@Component({
  selector: 'app-add-stock-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TranslateModule],
  templateUrl: './add-stock-modal.component.html',
  styleUrls: ['./add-stock-modal.component.scss']
})
export class AddStockModalComponent {
  @Input() partId!: number;
  @Output() submitted = new EventEmitter<AddStockDto>();
  @Output() cancel = new EventEmitter<void>();

  form: AddStockDto = { quantity: 1, reason: 'refill', unitCost: 0, reference: '' };

  onSubmit() {
    this.submitted.emit(this.form);
  }
}
