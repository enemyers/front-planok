import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  projectId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Verificar si estamos en modo edición
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.projectId = id; // Mantener como string para UUID
          this.isEditMode = true;
          this.isLoading = true;
          return this.projectService.getProjectById(id).pipe(
            catchError(error => {
              this.error = 'Error al cargar el proyecto. Por favor, inténtelo de nuevo.';
              this.isLoading = false;
              return EMPTY;
            })
          );
        }
        return of(null);
      })
    ).subscribe(project => {
      if (project) {
        this.populateForm(project);
      }
      this.isLoading = false;
    });
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      location: ['', Validators.required], // Agregando campo de ubicación obligatorio
      startDate: [''],
      endDate: [''],
      status: ['pending', Validators.required]
    });
  }

  populateForm(project: Project): void {
    console.log('Populating form with project:', project);
    this.projectForm.patchValue({
      name: project.nombre,
      description: project.descripcion || '',
      location: project.ubicacion || '',
      startDate: project.fecha_inicio ? new Date(project.fecha_inicio).toISOString().split('T')[0] : '',
      endDate: project.fecha_finalizacion ? new Date(project.fecha_finalizacion).toISOString().split('T')[0] : '',
      status: project.estado
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    // Mapeo de estados internos a valores esperados por el backend
    const statusMap: {[key: string]: string} = {
      'pending': 'Planificación',
      'active': 'En Construcción',
      'completed': 'Terminado',
      'cancelled': 'Cancelado'
    };
    
    // Obtener el valor del estado del formulario y mapearlo
    const formStatus = this.projectForm.value.status;
    const apiStatus = statusMap[formStatus] || formStatus;
    
    console.log(`Mapeando estado: ${formStatus} -> ${apiStatus}`);
    
    // Crear un objeto con los datos mínimos necesarios
    const projectData: any = {
      nombre: this.projectForm.value.name,
      descripcion: this.projectForm.value.description || '',
      ubicacion: this.projectForm.value.location,
      estado: apiStatus
    };
    
    if (!this.isEditMode) {
      projectData.codigo = 'P-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }
    
    if (this.projectForm.value.startDate) {
      try {
        const startDate = new Date(this.projectForm.value.startDate);
        projectData.fecha_inicio = startDate.toISOString().split('T')[0];
      } catch (e) {
        console.warn('Error formatting startDate', e);
      }
    }
    
    if (this.projectForm.value.endDate) {
      try {
        const endDate = new Date(this.projectForm.value.endDate);
        projectData.fecha_finalizacion = endDate.toISOString().split('T')[0];
      } catch (e) {
        console.warn('Error formatting endDate', e);
      }
    }
    
    let action$: Observable<Project>;

    if (this.isEditMode && this.projectId) {
      action$ = this.projectService.updateProject(String(this.projectId), projectData);
    } else {
      action$ = this.projectService.createProject(projectData);
    }

    action$.pipe(
      catchError(error => {
        this.error = `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el proyecto. Por favor, inténtelo de nuevo.`;
        return EMPTY;
      }),
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe(project => {
      this.router.navigate(['/dashboard/projects', project.id]);
    });
  }

  cancel(): void {
    if (this.isEditMode && this.projectId) {
      this.router.navigate(['/dashboard/projects', this.projectId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
