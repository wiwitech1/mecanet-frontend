import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonVariant, ButtonSize, ButtonRadius } from '../../components/button/button.component';

import { InformationPanelComponent } from '../../components/information-panel/information-panel.component';
import { InfoSectionComponent } from '../../components/information-panel/info-section/info-section.component';
import { InfoContainerComponent } from '../../components/information-panel/info-container/info-container.component';
import { InfoListItemsComponent } from '../../components/information-panel/info-list-items/info-list-items.component';
import { NotificationsContainerComponent, Notification } from '../../components/notifications-container/notifications-container.component';
import { SearchComponent } from '../../components/search/search.component';
import { RecordTableComponent, RecordTableColumn } from '../../components/record-table/record-table.component';
import { SidebarMecanetComponent } from '../../components/sidebar-mecanet/sidebar-mecanet.component';

@Component({
  selector: 'app-components-demo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    InformationPanelComponent,
    InfoSectionComponent,
    InfoContainerComponent,
    InfoListItemsComponent,
    NotificationsContainerComponent,
    SearchComponent,
    RecordTableComponent,
    SidebarMecanetComponent
  ],
  templateUrl: './components-demo.component.html',
  styleUrl: './components-demo.component.scss'
})
export class ComponentsDemoComponent {
  buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost'];
  buttonSizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  buttonRadiuses: ButtonRadius[] = ['none', 'sm', 'md', 'lg', 'full'];


  // Datos de ejemplo para el info-list
  infoListData = [
    { subtitle: 'Nombre', info: 'Juan Pérez' },
    { subtitle: 'Cargo', info: 'Técnico Especialista' },
    { subtitle: 'Departamento', info: 'Mantenimiento' }
  ];

  // Datos para info-list tipo 1 con máquina
  maquinaData = [
    { subtitle: 'Tipo', info: 'vista de datos 1' },
    { subtitle: '[showSubtitle]', info: 'false' },
    { subtitle: 'Datos', info: 'subtitle/info' },
  ];

  // Datos para info-list tipo 1 con especificaciones técnicas
  especificacionesData = [
    { subtitle: 'Tipo', info: 'vista de datos 1' },
    { subtitle: '[showSubtitle]', info: 'true' },
  ];

  // Datos para info-list tipo 2 con actividad
  actividadData = [
    { subtitle: 'Tipo', info: 'vista de datos 2' },
    { subtitle: 'Campos', info: 'subtitle/info' }
  ];


  // Añade estos datos para las estadísticas
  statisticsData = [
    {
      stadistic: 'Tipo:',
      percentage: 'Vista 3',
      description: 'Estadisticas'
    },
    {
      stadistic: 'stadistic',
      percentage: 'percentage',
      description: 'description'
    }
  ];

  // Datos para el historial de mantenimiento
  mantenimientoItems = [
    {
      date: '01/10/2024',
      type: 'Preventivo',
      responsible: 'María López'
    },
    {
      date: '15/04/2025',
      type: 'Correctivo',
      responsible: 'Luis Ramírez'
    }
  ];

  // Datos para maquinarias asociadas
  maquinariasItems = [
    { model: 'MT-450 M-01' },
    { model: 'CX-300 M-02' },
    { model: 'LT-820 M-05' }
  ];


  // Datos para historial de movimientos
  movimientosItems = [
    {
      date: '12/04/2025',
      action: 'Entrada 50 uds.',
      order: 'OC-456'
    },
    {
      date: '01/04/2025',
      action: 'Salida 10 uds.',
      order: 'Orden #123'
    }
  ];

  // Datos de ejemplo para notificaciones
  notificationItems: Notification[] = [
    {
      title: 'Alerta de Mantenimiento',
      message: 'La máquina A9BD2 presenta fallas en su funcionamiento.',
      type: 'error',
      icon: 'warning'
    },
    {
      title: 'Órdenes pendientes',
      message: 'Tienes 3 órdenes de trabajo esperando asignación de técnicos',
      type: 'notification',
      icon: 'notifications_active' // icono de tareas pendientes
    },
    {
      title: 'Mantenimiento programado',
      message: 'La máquina F34G5 se encuentra en mantenimiento',
      type: 'notification',
      icon: 'event_note' // icono de mantenimiento
    }
  ];




  userFilters = [
    {
      label: 'Estado',
      value: 'estado',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' }
      ]
    },
    {
      label: 'Rol',
      value: 'rol',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Admin', value: 'admin' },
        { label: 'Usuario', value: 'user' }
      ]
    }
  ];

  recordTableColumns: RecordTableColumn[] = [
    { key: 'nombre', label: 'Nombre', type: 'texto' },
    { key: 'edad', label: 'Edad', type: 'numero' },
    { key: 'info', label: 'Info', type: 'informacion' },
    { key: 'accion', label: 'Acción', type: 'cta', ctaLabel: 'Ver', ctaVariant: 'primary' }
  ];

  recordTableData = [
    { nombre: 'Juan', edad: 30, info: 'Usuario activo', accion: null },
    { nombre: 'Ana', edad: 25, info: 'Usuario nuevo', accion: null }
  ];

  handleButtonClick(event: MouseEvent): void {
    console.log('Botón clickeado:', event);
  }


  handlePrimaryButtonClick(): void {
    console.log('Botón primario clickeado');
    // Puedes hacer lo que necesites aquí
  }

  handleSecondaryButtonClick(): void {
    console.log('Botón secundario clickeado');
    // Puedes hacer lo que necesites aquí
  }


  handleSearch(event: string): void {
    console.log('Búsqueda:', event);
  }

  handleFilterChange(event: string): void {
    console.log('Filtro cambiado:', event);
  }

  handleAction(): void {
    console.log('Acción ejecutada');
  }

  openNewUserModal() {
    console.log('Abriendo modal para crear nuevo usuario');
    // Aquí puedes agregar la lógica para abrir un modal
  }

  handleCtaClick(event: any) {
    // Aquí tu lógica, por ejemplo:
    console.log('Acción CTA:', event);
  }

  handleLogout() {
    console.log('Logout clicked');
  }

}
