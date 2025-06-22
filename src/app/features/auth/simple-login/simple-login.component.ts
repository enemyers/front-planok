import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleAuthService } from './simple-auth.service';

@Component({
  selector: 'app-simple-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" style="max-width: 450px; margin: 2rem auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div class="card-body p-4">
        <h2 class="text-center mb-4">Iniciar sesión</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-4">
          <div class="form-group mb-4">
            <label for="email">Correo electrónico</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control" 
              placeholder="Ingrese su correo electrónico"
            />
            <div *ngIf="loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)" 
                 style="color: var(--danger-color); font-size: 0.875rem; margin-top: 0.25rem;">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">El correo electrónico es requerido</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Formato de correo electrónico inválido</span>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Ingrese su contraseña"
            />
            <div *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)"
                 style="color: var(--danger-color); font-size: 0.875rem; margin-top: 0.25rem;">
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="p-2 mb-4 text-center" style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger-color); border-radius: 4px;">
            {{ errorMessage }}
          </div>
          
          <div class="mt-4">
            <button 
              type="submit" 
              class="btn btn-primary" 
              style="width: 100%;"
              [disabled]="loginForm.invalid || isSubmitting"
            >
              <span *ngIf="isSubmitting" class="mr-2" style="display: inline-block;">
                <svg class="animate-spin" style="height: 1.2rem; width: 1.2rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isSubmitting ? 'Procesando...' : 'Iniciar sesión' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .form-control:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    }
    
    .btn {
      transition: all 0.3s ease;
    }
  `]
})
export class SimpleLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  
  // Inyección de dependencias
  private formBuilder = inject(FormBuilder);
  private authService = inject(SimpleAuthService);
  private router = inject(Router);
  
  constructor() {
    console.log('SimpleLoginComponent inicializado');
  }
  
  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Error al iniciar sesión. Por favor, inténtelo de nuevo.';
        console.error('Error de login:', error);
      }
    });
  }
}
