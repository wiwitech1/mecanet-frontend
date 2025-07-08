import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  success(title: string, message: string) {
    this.addNotification({
      title,
      message,
      type: 'success',
      icon: 'check_circle'
    });
  }

  error(title: string, message: string) {
    this.addNotification({
      title,
      message,
      type: 'error',
      icon: 'error'
    });
  }

  warning(title: string, message: string) {
    this.addNotification({
      title,
      message,
      type: 'warning',
      icon: 'warning'
    });
  }

  info(title: string, message: string) {
    this.addNotification({
      title,
      message,
      type: 'info',
      icon: 'info'
    });
  }

  private addNotification(notification: Notification) {
    const current = this.notifications.value;
    this.notifications.next([...current, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      const notifications = this.notifications.value;
      const index = notifications.indexOf(notification);
      if (index > -1) {
        notifications.splice(index, 1);
        this.notifications.next([...notifications]);
      }
    }, 5000);
  }
}
