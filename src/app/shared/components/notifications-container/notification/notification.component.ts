import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export type NotificationType = 'error' | 'notification'; 

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() title: string = '';  // Título de la notificación
  @Input() message: string = ''; // Mensaje de la notificación
  @Input() type: NotificationType = 'notification';  // Tipo de notificación
  @Input() icon: string = 'notification'; // Icono por defecto
  
  // Para configurar el ripple
  rippleColor = 'rgba(0, 0, 0, 0.1)'; // Color sutil para el efecto ripple
  
  getNotificationClass(): string {
    return `notification-${this.type}`;
  }
  
  getIconClass(): string {
    return `icon-${this.type}`;
  }
}