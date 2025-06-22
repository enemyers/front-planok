import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-notification-test',
  templateUrl: './notification-test.component.html',
  styleUrls: ['./notification-test.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificationTestComponent {
  
  constructor(
    private notificationService: NotificationService,

    private authService: AuthService
  ) {}

  showSuccessNotification(): void {
    this.notificationService.success('Esta es una notificación de éxito');
  }

  showErrorNotification(): void {
    this.notificationService.error('Esta es una notificación de error');
  }

  showInfoNotification(): void {
    this.notificationService.info('Esta es una notificación informativa');
  }

  showWarningNotification(): void {
    this.notificationService.warning('Esta es una notificación de advertencia');
  }


}
