import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { WorkOrderEntity, WorkOrderTechnician } from '../../models/work-order.entity';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-work-order-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TranslateModule],
  templateUrl: './work-order-form-modal.component.html',
  styleUrls: ['./work-order-form-modal.component.scss']
})
export class WorkOrderFormModalComponent implements OnInit {
  @Input() isEdit = false;
  @Input() orderData: Partial<WorkOrderEntity> | null = null;
  private originalData: Partial<WorkOrderEntity> | null = null;

  @Output() submit = new EventEmitter<Partial<WorkOrderEntity>>();
  @Output() delete = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  formData: Partial<WorkOrderEntity> = {
    code: '',
    date: '',
    productionLine: '',
    type: '',
    technicians: []
  };

  availableTechnicians: string[] = ['Juan Pérez', 'María López', 'Luis Ramírez', 'Ana García', 'Carlos Rodríguez'];
  availableMachines: string[] = ['MT-430', 'MT-450', 'MT-500', 'MT-600', 'MT-700', 'MT-800'];

  // Estructura para manejar técnicos dinámicamente
  technicianRows: Array<{
    technician: string;
    machines: string[];
  }> = [];

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    if (this.orderData) {
      this.originalData = { ...this.orderData };
      this.formData = {
        ...this.formData,
        ...this.orderData,
        technicians: this.orderData.technicians ?? []
      };

      // Convertir técnicos existentes al formato de filas
      this.technicianRows = (this.formData.technicians as WorkOrderTechnician[]).map(tech => ({
        technician: tech.name,
        machines: [...tech.machines]
      }));
    }

    // Si no hay técnicos, agregar una fila vacía
    if (this.technicianRows.length === 0) {
      this.addTechnicianRow();
    }
  }

  addTechnicianRow() {
    this.technicianRows.push({
      technician: '',
      machines: []
    });
  }

  removeTechnicianRow(index: number) {
    this.technicianRows.splice(index, 1);
  }

  updateTechnician(index: number, technician: string) {
    this.technicianRows[index].technician = technician;
  }

  updateMachines(index: number, machines: string[]) {
    this.technicianRows[index].machines = machines;
  }

  toggleMachine(technicianIndex: number, machine: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.technicianRows[technicianIndex].machines.includes(machine)) {
        this.technicianRows[technicianIndex].machines.push(machine);
      }
    } else {
      this.technicianRows[technicianIndex].machines = this.technicianRows[technicianIndex].machines.filter(m => m !== machine);
    }
  }

  handleSubmit() {
    // Convertir las filas de técnicos al formato esperado
    const technicians: WorkOrderTechnician[] = this.technicianRows
      .filter(row => row.technician && row.machines.length > 0)
      .map(row => ({
        name: row.technician,
        machines: [...row.machines]
      }));

    const formDataForBackend = {
      ...this.formData,
      technicians,
      id: this.originalData?.id
    };

    this.submit.emit(formDataForBackend);
  }

  handleCancel() {
    this.cancel.emit();
  }

  handleDelete() {
    if (confirm(this.translate.instant('workOrder.form.confirmDelete'))) {
      if (this.originalData?.id) {
        this.delete.emit(this.originalData.id);
      }
    }
  }
}
