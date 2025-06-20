import { Injectable } from '@angular/core';
import { WorkOrderEntity } from '../models/work-order.entity';
import { WorkOrderAssembler } from './work-order.assembler';
import { WorkOrderResource } from './work-order.resource';
import { WorkOrderApiResponse } from './work-order.response';

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  // Datos mock que simulan la respuesta de la API
  private mockApiData: WorkOrderResource[] = [
    {
      id: 1,
      code: 'PM-2025-04',
      date: '2025-03-10',
      production_line: 'L-01',
      type: 'Preventivo',
      status: 'pending',
      description: 'Mantenimiento preventivo mensual',
      priority: 'high',
      assigned_technicians: [
        {
          id: 1,
          name: 'Juan Pérez',
          email: 'juan.perez@company.com',
          assigned_machines: ['MT-430', 'MT-450'],
          assigned_at: '2025-03-01T08:00:00Z'
        },
        {
          id: 2,
          name: 'María López',
          email: 'maria.lopez@company.com',
          assigned_machines: [],
          assigned_at: '2025-03-01T08:00:00Z'
        }
      ],
      created_at: '2025-03-01T08:00:00Z',
      updated_at: '2025-03-01T08:00:00Z',
      created_by: 1,
      updated_by: 1
    },
    {
      id: 2,
      code: 'OT-2025-01',
      date: '2025-03-15',
      production_line: 'L-01',
      type: 'Correctivo',
      status: 'in_progress',
      description: 'Reparación de falla en motor principal',
      priority: 'urgent',
      assigned_technicians: [
        {
          id: 3,
          name: 'Luis Ramírez',
          email: 'luis.ramirez@company.com',
          assigned_machines: ['MT-500'],
          assigned_at: '2025-03-14T10:00:00Z'
        }
      ],
      created_at: '2025-03-14T09:00:00Z',
      updated_at: '2025-03-14T10:00:00Z',
      created_by: 1,
      updated_by: 1
    }
  ];

  constructor() {}

  /**
   * Obtiene todas las órdenes de trabajo
   * @returns Promise con la lista de entidades de órdenes de trabajo
   */
  async getOrders(): Promise<WorkOrderEntity[]> {
    try {
      // Simula llamada a la API
      const resources = [...this.mockApiData];
      return WorkOrderAssembler.resourcesToEntities(resources);
    } catch (error) {
      console.error('Error loading work orders:', error);
      throw error;
    }
  }

  /**
   * Obtiene una orden de trabajo por ID
   * @param id ID de la orden de trabajo
   * @returns Promise con la entidad de orden de trabajo o undefined
   */
  async getOrderById(id: number): Promise<WorkOrderEntity | undefined> {
    try {
      const resource = this.mockApiData.find(o => o.id === id);
      return resource ? WorkOrderAssembler.resourceToEntity(resource) : undefined;
    } catch (error) {
      console.error('Error loading work order:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva orden de trabajo
   * @param order Datos parciales de la orden de trabajo
   */
  async createOrder(order: Partial<WorkOrderEntity>): Promise<void> {
    try {
      const newEntity: WorkOrderEntity = {
        ...order,
        id: this.mockApiData.length + 1,
        technicians: order.technicians || [],
        status: order.status || 'pending',
        priority: order.priority || 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1
      } as WorkOrderEntity;

      // Convierte a resource para simular envío a API
      const resource = WorkOrderAssembler.entityToCreateResource(newEntity);

      // Simula respuesta de la API agregando campos de fechas
      const newResource: WorkOrderResource = {
        ...resource,
        id: newEntity.id!,
        assigned_technicians: resource.assigned_technicians?.map((tech, index) => ({
          id: index + 100,
          name: tech.name,
          email: tech.email,
          assigned_machines: tech.assigned_machines,
          assigned_at: new Date().toISOString()
        })) || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.mockApiData.push(newResource);
    } catch (error) {
      console.error('Error creating work order:', error);
      throw error;
    }
  }

  /**
   * Actualiza una orden de trabajo existente
   * @param id ID de la orden de trabajo
   * @param order Datos parciales para actualizar
   */
  async updateOrder(id: number, order: Partial<WorkOrderEntity>): Promise<void> {
    try {
      const idx = this.mockApiData.findIndex(o => o.id === id);
      if (idx > -1) {
        const existingResource = this.mockApiData[idx];
        const existingEntity = WorkOrderAssembler.resourceToEntity(existingResource);

        const updatedEntity: WorkOrderEntity = {
          ...existingEntity,
          ...order,
          updatedAt: new Date(),
          updatedBy: 1
        };

        const updateResource = WorkOrderAssembler.entityToUpdateResource(updatedEntity);

        // Actualiza el resource manteniendo campos de la API
        this.mockApiData[idx] = {
          ...existingResource,
          ...updateResource,
          updated_at: new Date().toISOString(),
          assigned_technicians: updateResource.assigned_technicians?.map((tech, index) => ({
            id: index + 100,
            name: tech.name,
            email: tech.email,
            assigned_machines: tech.assigned_machines,
            assigned_at: existingResource.assigned_technicians[index]?.assigned_at || new Date().toISOString()
          })) || []
        };
      }
    } catch (error) {
      console.error('Error updating work order:', error);
      throw error;
    }
  }

  /**
   * Elimina una orden de trabajo
   * @param id ID de la orden de trabajo a eliminar
   */
  async deleteOrder(id: number): Promise<void> {
    try {
      this.mockApiData = this.mockApiData.filter(o => o.id !== id);
    } catch (error) {
      console.error('Error deleting work order:', error);
      throw error;
    }
  }
}
