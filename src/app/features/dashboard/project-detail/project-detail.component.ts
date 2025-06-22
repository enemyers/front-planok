import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { Observable, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isLoading = false;
  error: string | null = null;
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProject();
  }

  loadProject(): void {
    this.isLoading = true;
    this.error = null;

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.router.navigate(['/dashboard']);
          return EMPTY;
        }
        return this.projectService.getProjectById(id).pipe(
          catchError(error => {
            this.error = 'Error al cargar el proyecto. Por favor, inténtelo de nuevo.';
            return EMPTY;
          }),
          finalize(() => {
            this.isLoading = false;
          })
        );
      })
    ).subscribe(project => {
      this.project = project;
    });
  }

  deleteProject(): void {
    if (!this.project) {
      return;
    }

    // Mostrar confirmación antes de eliminar
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      this.isDeleting = true;
      this.projectService.deleteProject(this.project.id)
        .pipe(
          finalize(() => this.isDeleting = false)
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
            this.notificationService.success('Proyecto eliminado con éxito');
          },
          error: (error) => {
            console.error('Error deleting project:', error);
            this.error = 'No se pudo eliminar el proyecto. Por favor, inténtelo de nuevo más tarde.';
            this.notificationService.error('Error al eliminar el proyecto');
          }
        });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'No definida';
    return new Date(date).toLocaleDateString();
  }
}
