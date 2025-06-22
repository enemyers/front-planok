import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  // La API JWT no devuelve información del usuario directamente
  // Tendremos que decodificar el token para obtener esa información
}

@Injectable({
  providedIn: 'root'
})
export class SimpleAuthService {
  constructor(private router: Router) {}
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Esta es una implementación simulada para fines de prueba
    console.log('Inicio de sesión con:', credentials);
    
    // Simular un retraso de red
    return of({
      access: 'mock_access_token',
      refresh: 'mock_refresh_token'
      // Ya no incluimos el objeto user directamente
    }).pipe(delay(1000));
  }
  
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    this.router.navigate(['/auth/login']);
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
