import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';

export interface Notification {
  title: string;
  message: string;
  type: 'error' | 'notification';
  icon: string;
}

@Component({
  selector: 'app-notifications-container',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './notifications-container.component.html',
  styleUrls: ['./notifications-container.component.scss']
})
export class NotificationsContainerComponent {
  @Input() title: string = 'Notificaciones';
  @Input() notifications: Notification[] = [];
} 