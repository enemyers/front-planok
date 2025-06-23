import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  isLoading = false;
  error: string | null = null;
  currentPage = 1;
  totalProjects = 0;
  pageSize = 10;
  // Filtros de búsqueda avanzada
  searchFilters = {
    term: '',            // Término general de búsqueda
    name: '',            // Nombre del proyecto
    location: '',        // Ubicación
    priceMin: null,      // Precio mínimo
    priceMax: null,      // Precio máximo
    code: '',            // Código del proyecto
    id: ''               // UUID del proyecto
  };
  showAdvancedSearch = false; // Control para mostrar/ocultar búsqueda avanzada
  showDeleteModal = false;
  projectToDelete: Project | null = null;
  Math = Math;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.error = null;

    // Base params para paginación
    const params: Record<string, any> = {
      page: this.currentPage,
      limit: this.pageSize
    };
    
    // Agregamos los filtros a los parámetros
    if (this.searchFilters.term?.trim()) {
      params['search'] = this.searchFilters.term.trim();
    }
    
    // Filtros específicos
    if (this.searchFilters.name?.trim()) {
      params['nombre'] = this.searchFilters.name.trim();
    }
    
    if (this.searchFilters.location?.trim()) {
      params['ubicacion'] = this.searchFilters.location.trim();
    }
    
    if (this.searchFilters.code?.trim()) {
      params['codigo'] = this.searchFilters.code.trim();
    }
    
    if (this.searchFilters.id?.trim()) {
      params['id'] = this.searchFilters.id.trim();
    }
    
    // Filtros de precio (si están definidos)
    if (this.searchFilters.priceMin !== null) {
      params['precio_min'] = this.searchFilters.priceMin;
    }
    
    if (this.searchFilters.priceMax !== null) {
      params['precio_max'] = this.searchFilters.priceMax;
    }

    this.projectService.getProjects(this.currentPage, this.pageSize, params)
      .pipe(
        catchError(error => {
          this.error = 'Error al cargar los proyectos. Por favor, inténtelo de nuevo.';
          return of({ projects: [], total: 0 });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.projects = response.projects;
        this.totalProjects = response.total;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProjects();
  }

  getStatusClass(status: string): string {
    const normalizedStatus = status?.toLowerCase() || '';
    
    if (normalizedStatus.includes('activ') || normalizedStatus.includes('active') || normalizedStatus.includes('construcci')) {
      return 'bg-green-100 text-green-800';
    } else if (normalizedStatus.includes('pend') || normalizedStatus.includes('planifi')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (normalizedStatus.includes('complet') || normalizedStatus.includes('termin') || normalizedStatus.includes('finaliz')) {
      return 'bg-blue-100 text-blue-800';
    } else if (normalizedStatus.includes('cancel') || normalizedStatus.includes('suspend')) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
  
  searchProjects(): void {
    this.currentPage = 1;
    console.log('Buscando con filtros:', this.searchFilters);
    this.loadProjects();
  }
  
  clearFilters(): void {
    this.searchFilters = {
      term: '',
      name: '',
      location: '',
      priceMin: null,
      priceMax: null,
      code: '',
      id: ''
    };
    this.currentPage = 1;
    this.loadProjects();
  }
  
  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }
  
  confirmDelete(project: Project): void {
    this.projectToDelete = project;
    this.showDeleteModal = true;
  }
  
  cancelDelete(): void {
    this.projectToDelete = null;
    this.showDeleteModal = false;
  }
  
  deleteProject(): void {
    if (!this.projectToDelete) return;
    
    const projectId = this.projectToDelete.id;
    this.isLoading = true;
    
    this.projectService.deleteProject(projectId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.showDeleteModal = false;
        })
      )
      .subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (error) => {
          this.error = 'Error al eliminar el proyecto. Por favor, inténtelo de nuevo.';
        }
      });
  }
}
