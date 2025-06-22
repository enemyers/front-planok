import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertType } from '../../shared/components/alert/alert.component';

export interface Notification {
  id: number;
  type: AlertType;
  message: string;
  autoClose: boolean;
  autoCloseDelay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private lastId = 0;

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  /**
   * Añade una nueva notificación
   * @param type Tipo de notificación
   * @param message Mensaje a mostrar
   * @param autoClose Si la notificación debe cerrarse automáticamente
   * @param autoCloseDelay Tiempo en ms antes de cerrar automáticamente
   * @returns ID de la notificación creada
   */
  addNotification(
    type: AlertType,
    message: string,
    autoClose: boolean = true,
    autoCloseDelay: number = 5000
  ): number {
    const id = ++this.lastId;
    const notification: Notification = {
      id,
      type,
      message,
      autoClose,
      autoCloseDelay
    };

    const currentNotifications = this.notifications.getValue();
    this.notifications.next([...currentNotifications, notification]);

    if (autoClose) {
      setTimeout(() => {
        this.removeNotification(id);
      }, autoCloseDelay);
    }

    return id;
  }

  /**
   * Elimina una notificación por su ID
   * @param id ID de la notificación a eliminar
   */
  removeNotification(id: number): void {
    const currentNotifications = this.notifications.getValue();
    this.notifications.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  /**
   * Elimina todas las notificaciones
   */
  clearNotifications(): void {
    this.notifications.next([]);
  }

  /**
   * Muestra una notificación de éxito
   * @param message Mensaje a mostrar
   * @param autoClose Si la notificación debe cerrarse automáticamente
   * @param autoCloseDelay Tiempo en ms antes de cerrar automáticamente
   * @returns ID de la notificación creada
   */
  success(message: string, autoClose: boolean = true, autoCloseDelay: number = 5000): number {
    return this.addNotification('success', message, autoClose, autoCloseDelay);
  }

  /**
   * Muestra una notificación de error
   * @param message Mensaje a mostrar
   * @param autoClose Si la notificación debe cerrarse automáticamente
   * @param autoCloseDelay Tiempo en ms antes de cerrar automáticamente
   * @returns ID de la notificación creada
   */
  error(message: string, autoClose: boolean = true, autoCloseDelay: number = 5000): number {
    return this.addNotification('error', message, autoClose, autoCloseDelay);
  }

  /**
   * Muestra una notificación de advertencia
   * @param message Mensaje a mostrar
   * @param autoClose Si la notificación debe cerrarse automáticamente
   * @param autoCloseDelay Tiempo en ms antes de cerrar automáticamente
   * @returns ID de la notificación creada
   */
  warning(message: string, autoClose: boolean = true, autoCloseDelay: number = 5000): number {
    return this.addNotification('warning', message, autoClose, autoCloseDelay);
  }

  /**
   * Muestra una notificación informativa
   * @param message Mensaje a mostrar
   * @param autoClose Si la notificación debe cerrarse automáticamente
   * @param autoCloseDelay Tiempo en ms antes de cerrar automáticamente
   * @returns ID de la notificación creada
   */
  info(message: string, autoClose: boolean = true, autoCloseDelay: number = 5000): number {
    return this.addNotification('info', message, autoClose, autoCloseDelay);
  }
}
