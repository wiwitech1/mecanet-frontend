import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';          // 👈 aquí vive *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatDividerModule }   from '@angular/material/divider';
import { Router, RouterModule }       from '@angular/router';
@Component({
  selector: 'app-login-view',
  standalone: true,                 // 👈 stand-alone component
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss'],
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
    MatDividerModule
  ],
})
export class LoginViewComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email()     { return this.loginForm.get('email')!; }
  get password()  { return this.loginForm.get('password')!; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    console.log('Login →', email, password);
    // TODO: llamar a tu servicio de autenticación
    this.router.navigate(['/']);
  }
}
