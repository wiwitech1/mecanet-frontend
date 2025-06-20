import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';          // 👈 aquí vive *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatDividerModule }   from '@angular/material/divider';
import { Router, RouterModule }       from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { UserResponse } from '../../services/user.response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { SignUpRequest, SignUpResponse } from '../../services/sign-up.response';

@Component({
  selector: 'app-register-view',
  standalone: true,                 // 👈 stand-alone component
  templateUrl: './register-view.component.html',
  styleUrls: ['./register-view.component.scss'],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
})
export class RegisterViewComponent implements OnInit {
  registerForm!: FormGroup;
  hide = true;
  currentStep = 1; // Controla el paso actual del stepper
  isLoading = false; // Indicador de carga

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // Información de la Empresa
      ruc: ['', Validators.required],
      legalName: ['', Validators.required],
      commercialName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      tenantPhone: ['', Validators.required],
      tenantEmail: ['', [Validators.required, Validators.email]],
      website: [''],

      // Información Personal
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      console.log('Error de validación: Las contraseñas no coinciden');
      return { passwordMismatch: true };
    }
    return null;
  }

  // Métodos para navegación del stepper
  nextStep(): void {
    if (this.currentStep < 2 && this.isStep1Valid()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Validación del paso 1
  isStep1Valid(): boolean {
    const step1Controls = [
      'ruc', 'legalName', 'commercialName', 'address',
      'city', 'country', 'tenantPhone', 'tenantEmail'
    ];

    return step1Controls.every(controlName => {
      const control = this.registerForm.get(controlName);
      return control && control.valid;
    });
  }

  // Getters para los campos del formulario
  get ruc() { return this.registerForm.get('ruc')!; }
  get legalName() { return this.registerForm.get('legalName')!; }
  get commercialName() { return this.registerForm.get('commercialName')!; }
  get address() { return this.registerForm.get('address')!; }
  get city() { return this.registerForm.get('city')!; }
  get country() { return this.registerForm.get('country')!; }
  get tenantPhone() { return this.registerForm.get('tenantPhone')!; }
  get tenantEmail() { return this.registerForm.get('tenantEmail')!; }
  get website() { return this.registerForm.get('website')!; }
  get username() { return this.registerForm.get('username')!; }
  get firstName() { return this.registerForm.get('firstName')!; }
  get lastName() { return this.registerForm.get('lastName')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }
  get terms() { return this.registerForm.get('terms')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true; // Activar indicador de carga

    const formData = this.registerForm.value;
    console.log('Datos del formulario:', formData);

    // Preparar los datos para el endpoint de registro
    const signUpData: SignUpRequest = {
      ruc: formData.ruc,
      legalName: formData.legalName,
      commercialName: formData.commercialName,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      tenantPhone: formData.tenantPhone,
      tenantEmail: formData.tenantEmail,
      website: formData.website || '',
      username: formData.username,
      password: formData.password,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName
    };

    console.log('Datos preparados para el endpoint:', signUpData);
    console.log('Validación del formulario:', this.registerForm.valid);
    console.log('Errores del formulario:', this.registerForm.errors);

    // Usar el servicio de autenticación para el registro
    this.authService.register(signUpData).subscribe({
      next: (response: SignUpResponse) => {
        console.log('Usuario registrado exitosamente:', response);


        this.router.navigate(['/iniciar-sesion']);
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        this.isLoading = false; // Desactivar indicador de carga en caso de error
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  // Método para hacer login automático después del registro
  private performAutoLogin(username: string, password: string): void {
    console.log('Iniciando login automático...');

    this.authService.login(username, password).subscribe({
      next: (userEntity) => {
        console.log('Login automático exitoso:', userEntity);
        this.isLoading = false; // Desactivar indicador de carga
        // Redirigir a la pantalla de inicio
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en login automático:', error);
        this.isLoading = false; // Desactivar indicador de carga
        // Si falla el login automático, redirigir al login manual
        this.router.navigate(['/iniciar-sesion']);
      }
    });
  }
}
