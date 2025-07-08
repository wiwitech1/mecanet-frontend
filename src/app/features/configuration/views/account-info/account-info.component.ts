import { Component, OnInit } from '@angular/core';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { ConfigurationPanelComponent } from '../../../../shared/components/configuration-panel/configuration-panel.component';
import { AccountService, User, UpdateUserRequest } from '../../services/account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [
    TitleViewComponent,
    NgClass,
    NgIf,
    NgFor,
    ConfigurationPanelComponent,
    ReactiveFormsModule
  ],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.scss'
})
export class AccountInfoComponent implements OnInit {
  userForm: FormGroup;
  currentUser: User | null = null;
  showPassword = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Por ahora hardcodeamos el ID 1, pero esto debería venir de un servicio de autenticación
    this.loadUserInfo(1);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  loadUserInfo(userId: number) {
    this.accountService.getUserInfo(userId).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userForm.patchValue({
          email: user.email,
          username: user.username,
          name: user.name
        });
      },
      error: (error) => {
        console.error('Error al cargar la información del usuario:', error);
        let message = 'Error al cargar la información del usuario';
        if (error.status === 401) {
          message = 'Sesión expirada. Por favor, vuelve a iniciar sesión.';
        } else if (error.error?.message) {
          message = error.error.message;
        }
        this.showError(message);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid && this.currentUser) {
      const updateData: UpdateUserRequest = {
        email: this.userForm.get('email')?.value,
        firstName: this.currentUser.name.split(' ')[0], // Mantenemos el nombre actual
        lastName: this.currentUser.name.split(' ')[1], // Mantenemos el apellido actual
        roles: this.currentUser.roles // Mantenemos los roles actuales
      };

      this.accountService.updateUserInfo(this.currentUser.id, updateData).subscribe({
        next: (updatedUser) => {
          this.currentUser = updatedUser;
          this.showSuccess('Información actualizada correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar la información:', error);
          let message = 'Error al actualizar la información';
          if (error.status === 401) {
            message = 'Sesión expirada. Por favor, vuelve a iniciar sesión.';
          } else if (error.error?.message) {
            message = error.error.message;
          }
          this.showError(message);
        }
      });
    }
  }

  getUserInitials(): string {
    if (!this.currentUser?.name) return '';
    return this.currentUser.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
