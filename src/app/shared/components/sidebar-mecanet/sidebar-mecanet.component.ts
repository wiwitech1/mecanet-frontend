import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { ThemeToggleComponent } from '../../../public/components/theme-toggle/theme-toggle.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../features/security/services/auth.service';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  children?: MenuItem[];
  badge?: {
    text: string;
    color: string;
  };
  roles?: string[];
  isActive?: boolean;
}

@Component({
  selector: 'app-sidebar-mecanet',
  templateUrl: './sidebar-mecanet.component.html',
  styleUrls: ['./sidebar-mecanet.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule, LanguageSwitcherComponent, ThemeToggleComponent],
})
export class SidebarMecanetComponent {
  isExpanded = false;

  // Menú dinámico
  menuItems: MenuItem[] = [
    {
      title: 'Inicio',
      icon: 'home',
      route: '/',
    },
    {
      title: 'Calendario',
      icon: 'calendar_today',
      route: '/calendario',
    },
    {
      title: 'Inventario',
      icon: 'inventory_2',
      route: '/inventario',
      children: [
        {
          title: 'Repuestos',
          route: '/inventario/repuestos',
          icon: 'category',
        },
        {
          title: 'Órdenes de compra',
          route: '/inventario/ordenes-compra',
          icon: 'receipt',
        },
      ],
    },
    {
      title: 'Gestión de Activos',
      icon: 'settings',
      route: '/activos',
      children: [
        {
          title: 'Plantas',
          route: '/activos/plantas',
          icon: 'factory',
        },
        {
          title: 'Líneas de Producción',
          route: '/activos/lineas-produccion',
          icon: 'account_tree',
        },
        {
          title: 'Maquinarias',
          route: '/activos/maquinarias',
          icon: 'precision_manufacturing',
        },

      ],
    },
    {
      title: 'Orden de Trabajo',
      icon: 'assignment',
      route: '/ordenes-trabajo',
      badge: {
        text: '5',
        color: 'primary'
      }
    },
    {
      title: 'Plan de Mantenimiento',
      icon: 'build',
      route: '/plan-mantenimiento',
    },
    {
      title: 'Ejecución',
      icon: 'play_circle',
      route: '/ejecucion',
    },
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      title: 'Administración del Personal',
      icon: 'people',
      route: '/personal',
      roles: ['admin', 'manager'],
    },
    {
      title: 'Administración de roles',
      icon: 'people',
      route: '/roles',
      roles: ['admin', 'manager'],
    },
    {
      title: 'Configuración',
      icon: 'settings',
      route: '/configuracion',
      roles: ['admin'],
    },
    {
      title: 'Demo',
      icon: 'settings',
      route: '/components-demo',
    },
  ];

  // Usuario actual (simulado)
  currentUser = {
    name: 'Juan Pérez',
    role: 'Administrador',
    avatar: 'assets/images/avatar.jpg',
    route: '/perfil'
  };

  constructor(private userService: UserService, private authService: AuthService) {}

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  expandSidebar() {
    this.isExpanded = true;
  }

  collapseSidebar() {
    this.isExpanded = false;
  }

  logout() {
    this.authService.logout();
  }

  // Método para verificar si el usuario tiene permisos para ver un item
  hasPermission(item: MenuItem): boolean {
    // Si no hay roles definidos, todos pueden ver
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    // Simulación de verificación de roles (en una app real, verificarías con un servicio de autenticación)
    // Por ahora, asumimos que el usuario actual tiene rol 'admin'
    const userRoles = ['admin'];
    return item.roles.some(role => userRoles.includes(role));
  }
}
