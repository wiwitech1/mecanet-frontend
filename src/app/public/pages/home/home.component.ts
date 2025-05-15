import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
interface Plant {
  id: number;
  name: string;
}

interface QuickLink {
  name: string;
  icon: string;
  route: string;
}

interface Notification {
  type: 'info' | 'warning' | 'success' | 'error';
  icon: string;
  message: string;
  time: string;
}

interface MaintenanceSchedule {
  date: {
    day: string;
    month: string;
  };
  equipment: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'scheduled' | 'in-progress';
}

interface Equipment {
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  statusText: string;
  icon: string;
}

interface InventoryItem {
  name: string;
  icon: string;
  current: number;
  minimum: number;
  status: 'critical' | 'warning' | 'normal';
}

interface ActivityItem {
  time: string;
  type: 'update' | 'create' | 'assign' | 'complete';
  icon: string;
  user: string;
  action: string;
  workOrderId: string;
  equipment: string;
}

interface Task {
  name: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Usuario actual
  userName: string = 'Carlos Rodríguez';
  userRole: string = 'Gerente de Mantenimiento';
  
  // Plantas
  selectedPlant: number = 1;
  plants: Plant[] = [
    { id: 1, name: 'Planta Central' },
    { id: 2, name: 'Planta Norte' },
    { id: 3, name: 'Planta Sur' }
  ];
  
  // Enlaces rápidos
  quickLinks: QuickLink[] = [
    { name: 'Usuarios', icon: 'people', route: '/usuarios' },
    { name: 'Mantenimiento', icon: 'build', route: '/plan-mantenimiento' },
    { name: 'Inventario', icon: 'inventory_2', route: '/inventario/repuestos' },
    { name: 'Órdenes', icon: 'receipt', route: '/inventario/ordenes-compra' },
    { name: 'Reportes', icon: 'bar_chart', route: '/reportes' },
    { name: 'Ajustes', icon: 'settings', route: '/ajustes' },
    {name : "Activos", icon: "build", route: "/activos/maquinarias"}
  ];
  
  // Notificaciones recientes
  recentNotifications: Notification[] = [
    {
      type: 'error',
      icon: 'warning',
      message: 'Alerta crítica: Motor principal de Línea A con fallo',
      time: 'Hace 10 minutos'
    },
    {
      type: 'warning',
      icon: 'priority_high',
      message: 'Stock de rodamientos SKF-2542 bajo mínimo',
      time: 'Hace 2 horas'
    },
    {
      type: 'info',
      icon: 'info',
      message: 'OT #5283 actualizada por José Gómez',
      time: 'Hace 3 horas'
    },
    {
      type: 'success',
      icon: 'check_circle',
      message: 'Mantenimiento de Empacadora L2 completado',
      time: 'Hace 5 horas'
    },
    {
      type: 'info',
      icon: 'schedule',
      message: 'Recordatorio: Reunión de planificación mañana 9:00AM',
      time: 'Hace 1 día'
    }
  ];
  
  // Mantenimientos programados
  scheduledMaintenance: MaintenanceSchedule[] = [
    {
      date: { day: '12', month: 'Mayo' },
      equipment: 'Línea Ensamblado A12',
      priority: 'high',
      status: 'scheduled'
    },
    {
      date: { day: '15', month: 'Mayo' },
      equipment: 'Compresor Industrial C5',
      priority: 'medium',
      status: 'pending'
    },
    {
      date: { day: '18', month: 'Mayo' },
      equipment: 'Transportador T-4',
      priority: 'low',
      status: 'scheduled'
    },
    {
      date: { day: '22', month: 'Mayo' },
      equipment: 'Sistema Refrigeración',
      priority: 'medium',
      status: 'pending'
    },
    {
      date: { day: '25', month: 'Mayo' },
      equipment: 'Bomba Hidráulica P2',
      priority: 'high',
      status: 'in-progress'
    }
  ];
  
  // Estado de equipos
  equipmentStatus: Equipment[] = [
    {
      name: 'Empacadora L1',
      location: 'Zona A, Planta Central',
      status: 'active',
      statusText: 'Activo',
      icon: 'check_circle'
    },
    {
      name: 'Transportador T3',
      location: 'Zona B, Planta Central',
      status: 'inactive',
      statusText: 'Detenido',
      icon: 'cancel'
    },
    {
      name: 'Compresor C2',
      location: 'Zona Externa, Planta Central',
      status: 'maintenance',
      statusText: 'En Mantenimiento',
      icon: 'build'
    },
    {
      name: 'Reactor R5',
      location: 'Zona D, Planta Central',
      status: 'active',
      statusText: 'Activo',
      icon: 'check_circle'
    }
  ];
  
  // Salud del inventario
  inventoryHealth: InventoryItem[] = [
    {
      name: 'Rodamientos SKF-2542',
      icon: 'settings',
      current: 5,
      minimum: 20,
      status: 'critical'
    },
    {
      name: 'Correas Transmisión A-42',
      icon: 'sync_alt',
      current: 12,
      minimum: 15,
      status: 'warning'
    },
    {
      name: 'Filtros HEPA F-100',
      icon: 'filter_alt',
      current: 8,
      minimum: 10,
      status: 'warning'
    },
    {
      name: 'Aceite Lubricante L-1000',
      icon: 'opacity',
      current: 150,
      minimum: 50,
      status: 'normal'
    },
    {
      name: 'Sensores Proximidad SP-12',
      icon: 'sensors',
      current: 25,
      minimum: 10,
      status: 'normal'
    },
    {
      name: 'Válvulas Reguladoras VR-30',
      icon: 'tune',
      current: 3,
      minimum: 8,
      status: 'critical'
    }
  ];
  
  // Actividad reciente
  recentActivity: ActivityItem[] = [
    {
      time: '10:25 AM',
      type: 'update',
      icon: 'update',
      user: 'Ana Martínez',
      action: 'actualizó el estado de la orden de trabajo',
      workOrderId: 'OT-5283',
      equipment: 'Empacadora L1'
    },
    {
      time: '09:15 AM',
      type: 'create',
      icon: 'add_circle',
      user: 'Carlos Rodríguez',
      action: 'creó una nueva orden de trabajo',
      workOrderId: 'OT-5284',
      equipment: 'Transportador T3'
    },
    {
      time: 'Ayer',
      type: 'assign',
      icon: 'person_add',
      user: 'Laura Gómez',
      action: 'asignó la orden de trabajo a Juan Pérez',
      workOrderId: 'OT-5280',
      equipment: 'Compresor C2'
    },
    {
      time: 'Ayer',
      type: 'complete',
      icon: 'task_alt',
      user: 'Juan Pérez',
      action: 'completó la orden de trabajo',
      workOrderId: 'OT-5279',
      equipment: 'Reactor R5'
    }
  ];
  
  // Tareas próximas
  upcomingTasks: Task[] = [
    {
      name: 'Revisar informe de mantenimiento preventivo',
      dueDate: 'Hoy, 17:00',
      priority: 'high'
    },
    {
      name: 'Planificar rotación de personal',
      dueDate: 'Mañana, 12:00',
      priority: 'medium'
    },
    {
      name: 'Verificar orden de compra #8742',
      dueDate: '15 Mayo',
      priority: 'low'
    }
  ];
}
