import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { UserEntity } from '../../services/user-api.service';

@Component({
  selector: 'app-personnet-administration-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './personnet-administration-form-modal.component.html',
  styleUrls: ['./personnet-administration-form-modal.component.scss']
})
export class PersonnetAdministrationFormModalComponent implements OnInit {
  @Input() isEdit = false;
  @Input() userData: Partial<UserEntity> | null = null;
  private originalData: Partial<UserEntity> | null = null;

  @Output() submit = new EventEmitter<Partial<UserEntity>>();
  @Output() delete = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  formData: Partial<UserEntity> = {
    code: '',
    name: '',
    email: '',
    role: 'user',
    phone: '',
    address: '',
    status: 'active'
  };

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' }
  ];

  ngOnInit() {
    if (this.userData) {
      this.originalData = this.userData;
      this.formData = {
        ...this.formData,
        ...this.userData
      };
    }
  }

  handleSubmit() {
    if (this.validateForm()) {
      this.submit.emit({
        ...this.formData,
        id: (this.userData as any)?.id
      });
    }
  }

  handleCancel() {
    this.cancel.emit();
  }

  handleDelete() {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      if (this.originalData?.id) {
        this.delete.emit(this.originalData.id);
      }
    }
  }

  private validateForm(): boolean {
    if (!this.formData.code?.trim()) {
      alert('El código es requerido');
      return false;
    }
    if (!this.formData.name?.trim()) {
      alert('El nombre es requerido');
      return false;
    }
    if (!this.formData.email?.trim()) {
      alert('El email es requerido');
      return false;
    }
    if (!this.validateEmail(this.formData.email)) {
      alert('El email no es válido');
      return false;
    }
    return true;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
