import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, finalize, forkJoin, map, of } from 'rxjs';
import { Project } from '../../../core/models/project.model';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
}

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardStatsComponent implements OnInit {
  stats: DashboardStats = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingProjects: 0
  };
  isLoading = false;
  error: string | null = null;
  username: string = '';

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.firstName || currentUser.username || currentUser.email;
    }
  }

  loadStats(): void {
    this.isLoading = true;
    this.error = null;

    this.projectService.getProjects(1, 100)
      .pipe(
        map(response => {
          const projects = response.projects || [];
          
          this.stats = {
            totalProjects: projects.length,
            activeProjects: projects.filter(p => p.status === 'active').length,
            completedProjects: projects.filter(p => p.status === 'completed').length,
            pendingProjects: projects.filter(p => p.status === 'pending').length
          };
          
          return projects;
        }),
        catchError(error => {
          console.error('Error loading dashboard stats:', error);
          this.error = 'No se pudieron cargar las estadísticas';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
}
