import { Injectable } from '@angular/core';
import { Observable, throwError, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

import { AuthService } from './auth.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly BASE_PATH = 'v1/proyectos/';

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,

    private authService: AuthService
  ) { }

  /**
   * Obtiene todos los proyectos
   * @param page Número de página
   * @param limit Límite de resultados por página
   * @param additionalParams Parámetros adicionales como búsqueda
   * @returns Observable con la lista de proyectos
   */
  getProjects(page: number = 1, limit: number = 10, additionalParams: Record<string, any> = {}): Observable<{ projects: Project[], total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    // Añadir parámetros adicionales como términos de búsqueda
    Object.keys(additionalParams).forEach(key => {
      params = params.set(key, additionalParams[key]);
    });
    
    return this.apiService.get<{ results: Project[], count?: number }>(this.BASE_PATH, params)
      .pipe(
        map(response => {
          // Procesar los proyectos para tener propiedades compatibles con la interfaz anterior
          const projects = response.results.map(proyecto => ({
            ...proyecto,
            name: proyecto.nombre,
            description: proyecto.descripcion,
            status: proyecto.estado,
            createdAt: new Date(proyecto.created_at)
          }));
          
          return {
            projects: projects,
            total: response.count || projects.length
          };
        }),
        catchError(error => {
          console.error('Error fetching projects:', error);
          this.notificationService.error('Error al cargar los proyectos');
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene un proyecto por su ID
   * @param id ID del proyecto
   * @returns Observable con el proyecto
   */
  getProjectById(id: string): Observable<Project> {
    // Aplicamos la misma lógica que en updateProject para construir la URL correctamente
    const cleanBasePath = this.BASE_PATH.replace(/^\/|\/$/, '');
    const cleanId = id.replace(/\//g, '');
    const path = `${cleanBasePath}/${cleanId}/`;
    console.log('URL path for getById:', path);
    
    return this.apiService.get<Project>(path)
      .pipe(
        map(proyecto => ({
          ...proyecto,
          name: proyecto.nombre,
          description: proyecto.descripcion,
          status: proyecto.estado,
          createdAt: new Date(proyecto.created_at)
        })),
        catchError(error => {
          console.error(`Error fetching project with id ${id}:`, error);
          this.notificationService.error(`Error al cargar el proyecto #${id}`);
          return throwError(() => error);
        })
      );
  }

  /**
   * Crea un nuevo proyecto
   * @param project Datos del proyecto a crear
   * @returns Observable con el proyecto creado
   */
  createProject(project: Partial<Project>): Observable<Project> {
    console.log('ProjectService.createProject - Payload:', project);
    // Para Django, aseguramos que la URL TERMINE con una barra diagonal
    // Ya que Django tiene APPEND_SLASH activado y no puede redireccionar peticiones POST
    const cleanBasePath = this.BASE_PATH.replace(/^\/|\/$/, '');
    const path = `${cleanBasePath}/`;
    
    console.log('URL path for create:', path);
    
    return this.apiService.post<Project>(path, project)
      .pipe(
        tap((createdProject) => {
          this.notificationService.success('Proyecto creado con éxito');
          console.log('Proyecto creado:', createdProject);
        }),
        catchError(error => {
          console.error('Error al crear proyecto:', error);
          if (error.error) {
            console.error('Detalle del error:', error.error);
          }
          
          // Mostrar mensaje más específico al usuario
          let errorMsg = 'Error al crear el proyecto';
          if (error.status === 500) {
            errorMsg += ': Error interno del servidor';
          } else if (error.error && error.error.detail) {
            errorMsg += `: ${error.error.detail}`;
          }
          
          this.notificationService.error(errorMsg);
          return throwError(() => error);
        })
      );
  }

  /**
   * Actualiza un proyecto existente
   * @param id ID del proyecto
   * @param project Datos del proyecto a actualizar
   * @returns Observable con el proyecto actualizado
   */
  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    console.log('ProjectService.updateProject - ID:', id, 'Payload:', project);
    
    // IMPORTANTE: El API_URL se modifica en ApiService.put y siempre agrega una barra
    // Necesitamos asegurarnos de que la ruta sea exactamente: v1/proyectos/ID/
    
    // Limpiamos cualquier barra diagonal al principio o final del BASE_PATH
    const cleanBasePath = this.BASE_PATH.replace(/^\/|\/$/, '');
    
    // Limpiamos el ID de cualquier barra diagonal
    const cleanId = id.replace(/\//g, '');
    
    // Creamos la ruta final que ApiService usará
    const path = `${cleanBasePath}/${cleanId}/`;
    
    console.log('URL path for update:', path);
    
    return this.apiService.put<Project>(path, project)
      .pipe(
        tap((updatedProject) => {
          this.notificationService.success('Proyecto actualizado con éxito');
          console.log('Proyecto actualizado:', updatedProject);
        }),
        catchError(error => {
          console.error(`Error al actualizar proyecto ${id}:`, error);
          if (error.error) {
            console.error('Detalle del error:', error.error);
          }
          if (error.status === 404) {
            console.error('Posible problema de ID:', id, '- asegúrate de usar un UUID válido');
          }
          
          // Mostrar mensaje más específico al usuario
          let errorMsg = 'Error al actualizar el proyecto';
          if (error.status === 500) {
            errorMsg += ': Error interno del servidor';
          } else if (error.status === 404) {
            errorMsg += ': No se encontró el proyecto';
          } else if (error.error && error.error.detail) {
            errorMsg += `: ${error.error.detail}`;
          }
          
          this.notificationService.error(errorMsg);
          return throwError(() => error);
        })
      );
  }

  /**
   * Elimina un proyecto
   * @param id ID del proyecto a eliminar
   * @returns Observable vacío
   */
  deleteProject(id: string): Observable<void> {
    // Primero obtenemos el proyecto para tener su nombre antes de eliminarlo
    return new Observable<void>(observer => {
      this.getProjectById(id).subscribe({
        next: (project) => {
          // Guardamos el nombre del proyecto para usarlo en la actividad
          const projectName = project.name;
          
          // Ahora eliminamos el proyecto
          // Aplicamos la misma lógica que en updateProject para construir la URL correctamente
          const cleanBasePath = this.BASE_PATH.replace(/^\/|\/$/, '');
          const cleanId = id.replace(/\//g, '');
          const path = `${cleanBasePath}/${cleanId}/`;
          console.log('URL path for delete:', path);
          
          this.apiService.delete<void>(path).subscribe({
            next: () => {
              this.notificationService.success('Proyecto eliminado con éxito');
              

              
              observer.next();
              observer.complete();
            },
            error: (error) => {
              this.notificationService.error('Error al eliminar el proyecto');
              observer.error(error);
            }
          });
        },
        error: (error) => {
          this.notificationService.error('Error al eliminar el proyecto');
          observer.error(error);
        }
      });
    });
  }
}
