import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, tap, BehaviorSubject, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private apiService: ApiService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private notificationService: NotificationService,

  ) {
    this.loadStoredUserData();
  }
  
  private loadStoredUserData(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data', error);
        this.logout();
      }
    }
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('v2/token/', credentials)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
          this.notificationService.success('Inicio de sesión exitoso');
          

        }),
        catchError(error => {
          this.notificationService.error('Error al iniciar sesión: ' + (error.error?.message || 'Credenciales inválidas'));
          return throwError(() => error);
        })
      );
  }
  
  private handleAuthentication(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refresh);
    
    // Decodificar el token para obtener la información del usuario
    const token = authResponse.access;
    const decodedToken = this.jwtHelper.decodeToken(token);
    
    // Extraer la información del usuario del token decodificado
    const user: User = {
      id: decodedToken.user_id,
      email: decodedToken.email || '',
      username: decodedToken.username || ''
    };
    
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  logout(): void {
    const currentUser = this.getCurrentUser();
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.notificationService.info('Has cerrado sesión correctamente');
    

  }
  
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return this.apiService.post<AuthResponse>('v2/token/refresh/', { refresh: refreshToken })
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
