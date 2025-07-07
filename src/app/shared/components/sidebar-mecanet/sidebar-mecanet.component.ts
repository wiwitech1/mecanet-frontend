import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { ThemeToggleComponent } from '../../../public/components/theme-toggle/theme-toggle.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../features/security/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

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
  imports: [MatIconModule, CommonModule, RouterModule, LanguageSwitcherComponent, ThemeToggleComponent, TranslateModule],
})
export class SidebarMecanetComponent implements OnInit {
  isExpanded = true;

  // Menú dinámico
  menuItems: MenuItem[] = [
    {
      title: 'sidebar.menu.home',
      icon: 'home',
      route: '/',
    },
    {
      title: 'sidebar.menu.calendar',
      icon: 'calendar_today',
      route: '/calendario',
    },
    {
      title: 'sidebar.menu.inventory.title',
      icon: 'inventory_2',
      route: '/inventario',
      children: [
        {
          title: 'sidebar.menu.inventory.parts',
          route: '/inventario/repuestos',
          icon: 'category',
        },
        {
          title: 'sidebar.menu.inventory.purchaseOrders',
          route: '/inventario/ordenes-compra',
          icon: 'receipt',
        },
      ],
    },
    {
      title: 'sidebar.menu.assetManagement.title',
      icon: 'settings',
      route: '/activos',
      children: [
        {
          title: 'sidebar.menu.assetManagement.plants',
          route: '/activos/plantas',
          icon: 'factory',
        },
        {
          title: 'sidebar.menu.assetManagement.productionLines',
          route: '/activos/lineas-produccion',
          icon: 'account_tree',
        },
        {
          title: 'sidebar.menu.assetManagement.machinery',
          route: '/activos/maquinarias',
          icon: 'precision_manufacturing',
        },

        {
          title: 'sidebar.menu.assetManagement.machineryMetrics',
          route: '/activos/metricas',
          icon: 'precision_manufacturing',
        }

      ],
    },
    {
      title: 'sidebar.menu.workOrder',
      icon: 'assignment',
      route: '/ordenes-trabajo',
      badge: {
        text: '5',
        color: 'primary'
      }
    },
    {
      title: 'sidebar.menu.maintenancePlan',
      icon: 'build',
      route: '/plan-mantenimiento',
    },
    {
      title: 'sidebar.menu.execution',
      icon: 'play_circle',
      route: '/ejecucion',
    },
    /*
    {
      title: 'sidebar.menu.dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },*/
    {
      title: 'sidebar.menu.staffManagement',
      icon: 'people',
      route: '/personal',
      roles: ['admin', 'manager'],
    },
    {
      title: 'sidebar.menu.settings',
      icon: 'settings',
      route: '/ajustes/cuenta',
      roles: ['admin'],
    },
    /*{
      title: 'sidebar.menu.demo',
      icon: 'settings',
      route: '/components-demo',
    },*/
  ];

  // Usuario actual (leído desde localStorage)
  currentUser = {
    name: '',
    role: '',
    avatar: 'assets/images/avatar.jpg',
    route: '/perfil'
  };

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.loadUserFromLocalStorage();
  }

  loadUserFromLocalStorage() {
    try {
      const userData = localStorage.getItem('userSession');
      if (userData) {
        const user = JSON.parse(userData);
        this.currentUser.name = user.username || 'Usuario';

        // Determinar el rol basado en los roles del usuario
        if (user.roles && user.roles.includes('ROLE_ADMIN')) {
          this.currentUser.role = 'sidebar.user.admin';
        } else {
          this.currentUser.role = 'sidebar.user.technician';
        }
      } else {
        console.log('No se encontraron datos de usuario en localStorage');
        this.currentUser.name = 'Usuario';
        this.currentUser.role = 'sidebar.user.technician';
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario desde localStorage:', error);
      this.currentUser.name = 'Usuario';
      this.currentUser.role = 'sidebar.user.technician';
    }
  }

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
