import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-mecanet',
  templateUrl: './sidebar-mecanet.component.html',
  styleUrls: ['./sidebar-mecanet.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
})
export class SidebarMecanetComponent {
  @Input() userName: string = '';
  @Input() userRole: string = '';

  isExpanded = false;

  menuOptions = [
    { path: '/inicio', title: 'Inicio', icon: 'home' },
    { path: '/calendario', title: 'Calendario', icon: 'calendar_today' },
    {
      path: '/inventario',
      title: 'Inventario',
      icon: 'inventory_2',
      submenu: [
        { path: '/inventario/repuestos', title: 'Repuestos' },
        { path: '/inventario/ordenes-compra', title: 'Órdenes de compra' }
      ]
    },
    {
      path: '/gestion-activos',
      title: 'Gestión de Activos',
      icon: 'settings',
      submenu: [
        { path: '/gestion-activos/maquinarias', title: 'Maquinarias' },
        { path: '/gestion-activos/lineas-produccion', title: 'Líneas de Producción' }
      ]
    },
    { path: '/orden-trabajo', title: 'Orden de Trabajo', icon: 'assignment' },
    { path: '/plan-mantenimiento', title: 'Plan de Mantenimiento', icon: 'build' },
    { path: '/ejecucion', title: 'Ejecución', icon: 'play_circle' },
    { path: '/dashboard', title: 'Dashboard', icon: 'dashboard' },
    { path: '/administracion-personal', title: 'Administración del Personal', icon: 'people' },
    { path: '/configuracion', title: 'Configuración', icon: 'settings' }
  ];

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  expandSidebar() {
    this.isExpanded = true;
  }

  collapseSidebar() {
    this.isExpanded = false;
  }
}
