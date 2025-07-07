import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PersonalEntity, PersonalRole } from '../../model/personal.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-form',
  templateUrl: './personal-form.component.html',
  styleUrls: ['./personal-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TranslateModule]
})
export class PersonalFormComponent implements OnInit {
  @Input() isEdit = false;
  @Input() personalData: Partial<PersonalEntity> | null = null;
  @Output() submit = new EventEmitter<Partial<PersonalEntity>>();
  @Output() cancel = new EventEmitter<void>();

  formData: Partial<PersonalEntity> = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: ['ROLE_TECHNICAL']
  };

  roles: { value: PersonalRole; label: string }[] = [
    { value: 'ROLE_TECHNICAL', label: 'personal.roles.technical' },
    { value: 'ROLE_ADMIN', label: 'personal.roles.admin' }
  ];

  ngOnInit() {
    if (this.isEdit && this.personalData) {
      this.formData = {
        ...this.formData,
        ...this.personalData
      };
    }
  }

  handleSubmit() {
    const requiredFields = ['username', 'firstName', 'lastName', 'email', 'password', 'roles'];

    const missing = requiredFields.filter(
      field => !this.formData[field as keyof Partial<PersonalEntity>] ||
               (Array.isArray(this.formData[field as keyof Partial<PersonalEntity>])
                ? !(this.formData[field as keyof Partial<PersonalEntity>] as any[]).length
                : this.formData[field as keyof Partial<PersonalEntity>]?.toString().trim() === '')
    );

    if (missing.length > 0) {
      // TODO: Use notification service
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.submit.emit(this.formData);
  }

  handleCancel() {
    this.cancel.emit();
  }

  get currentRole(): PersonalRole {
    return this.formData.roles?.[0] || 'ROLE_TECHNICAL';
  }

  set currentRole(value: PersonalRole) {
    this.formData.roles = [value];
  }
}
