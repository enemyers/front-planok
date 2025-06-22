import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ]
})
export class AlertComponent implements OnInit {
  @Input() type: AlertType = 'info';
  @Input() message: string = '';
  @Input() dismissible: boolean = true;
  @Input() autoClose: boolean = false;
  @Input() autoCloseDelay: number = 5000; // 5 segundos por defecto
  
  visible: boolean = true;
  
  constructor() {}
  
  ngOnInit(): void {
    if (this.autoClose) {
      setTimeout(() => {
        this.close();
      }, this.autoCloseDelay);
    }
  }
  
  close(): void {
    this.visible = false;
  }
  
  getIconClass(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }
  
  getBackgroundClass(): string {
    switch (this.type) {
      case 'success':
        return 'bg-green-50 border-green-400';
      case 'error':
        return 'bg-red-50 border-red-400';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400';
      case 'info':
        return 'bg-blue-50 border-blue-400';
      default:
        return 'bg-gray-50 border-gray-400';
    }
  }
  
  getTextClass(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  }
}
