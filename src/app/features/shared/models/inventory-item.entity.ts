export type InventoryCategory =
  | 'REPUESTO'
  | 'HERRAMIENTA'
  | 'CONSUMIBLE'
  | 'EQUIPO'
  | 'SEGURIDAD'
  | 'MATERIAL';

export class InventoryItemEntity {
  sku!: string;
  name!: string;
  description!: string;
  category!: InventoryCategory;
  unit!: string;
  unitPrice!: number;
  minimumStock!: number;
  location!: string;
  plantId!: number;
  compatibleMachineIds: number[] = [];

  constructor(data: Partial<InventoryItemEntity> = {}) {
    this.sku = data.sku || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = (data.category as InventoryCategory) || 'REPUESTO';
    this.unit = data.unit || '';
    this.unitPrice = data.unitPrice ?? 0;
    this.minimumStock = data.minimumStock ?? 0;
    this.location = data.location || '';
    this.plantId = data.plantId ?? 1;
    this.compatibleMachineIds = data.compatibleMachineIds ?? [];
  }
}
