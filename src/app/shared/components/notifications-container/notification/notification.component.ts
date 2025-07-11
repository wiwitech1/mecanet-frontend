import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: NotificationType = 'info';
  @Input() icon: string = 'info';

  rippleColor = 'rgba(0, 0, 0, 0.1)';

  getNotificationClass(): string {
    return `notification-${this.type}`;
  }

  getIconClass(): string {
    return `icon-${this.type}`;
  }
}
