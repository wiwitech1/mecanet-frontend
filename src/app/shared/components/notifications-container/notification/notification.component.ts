import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; 

export type NotificationType = 'error' | 'notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() title: string = '';  // Título de la notificación
  @Input() message: string = ''; // Mensaje de la notificación
  @Input() type: 'error' | 'notification' = 'notification';  // Tipo de notificación
  @Input() icon: string = ''; // Icono a mostrar en la notificación

  // Clase dinámica para el icono
  getIconClass() {
    return this.type === 'error' ? 'error' : 'notification';
  }
  
  getNotificationClass() {
    return this.type === 'error' ? 'notification-error' : 'notification-info';
  }
}