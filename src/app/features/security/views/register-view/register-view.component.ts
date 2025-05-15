import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';          // 👈 aquí vive *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatDividerModule }   from '@angular/material/divider';
import { Router, RouterModule }       from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatCheckboxModule
  ],
})
export class RegisterViewComponent implements OnInit {
  registerForm!: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      companyName: ['', Validators.required],
      ruc: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  get companyName() { return this.registerForm.get('companyName')!; }
  get ruc() { return this.registerForm.get('ruc')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }
  get terms() { return this.registerForm.get('terms')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { companyName, ruc, email, password } = this.registerForm.value;
    console.log('Register →', companyName, ruc, email, password);
    // TODO: llamar a tu servicio de autenticación
    this.router.navigate(['/']);
  }
}
