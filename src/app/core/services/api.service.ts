import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Realiza una petición GET al backend
   * @param path Ruta relativa al API_URL
   * @param params Parámetros opcionales de la petición
   * @returns Observable con la respuesta del servidor
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    // Aseguramos que no haya barras duplicadas entre API_URL y path
    const baseUrl = this.API_URL.endsWith('/') ? this.API_URL.slice(0, -1) : this.API_URL;
    const fullPath = `${baseUrl}/${path}`;
    console.log('Request URL:', fullPath); // Depuración para ver la URL completa
    return this.http.get<T>(fullPath, { params });
  }

  /**
   * Realiza una petición POST al backend
   * @param path Ruta relativa al API_URL
   * @param body Cuerpo de la petición
   * @returns Observable con la respuesta del servidor
   */
  post<T>(path: string, body: any): Observable<T> {
    const baseUrl = this.API_URL.endsWith('/') ? this.API_URL.slice(0, -1) : this.API_URL;
    const fullPath = `${baseUrl}/${path}`;
    console.log('Request URL (POST):', fullPath);
    return this.http.post<T>(fullPath, body);
  }

  /**
   * Realiza una petición PUT al backend
   * @param path Ruta relativa al API_URL
   * @param body Cuerpo de la petición
   * @returns Observable con la respuesta del servidor
   */
  put<T>(path: string, body: any): Observable<T> {
    const baseUrl = this.API_URL.endsWith('/') ? this.API_URL.slice(0, -1) : this.API_URL;
    const fullPath = `${baseUrl}/${path}`;
    console.log('Request URL (PUT):', fullPath);
    return this.http.put<T>(fullPath, body);
  }

  /**
   * Realiza una petición DELETE al backend
   * @param path Ruta relativa al API_URL
   * @returns Observable con la respuesta del servidor
   */
  delete<T>(path: string): Observable<T> {
    const baseUrl = this.API_URL.endsWith('/') ? this.API_URL.slice(0, -1) : this.API_URL;
    const fullPath = `${baseUrl}/${path}`;
    console.log('Request URL (DELETE):', fullPath);
    return this.http.delete<T>(fullPath);
  }
}
