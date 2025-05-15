import { InventoryPartResponse, InventoryPartResource } from "./inventory-parts.response";
import { InventoryPartEntity } from "../models/inventory-part.entity";

export class InventoryPartAssembler {
    static toEntitiesFromResponse(response: InventoryPartResponse): InventoryPartEntity[] {
        if (!response.data) {
            console.error("Respuesta inesperada:", response);
            return [];
        }
        const inventoryPartResponse = new InventoryPartResponse(response.data);
        return inventoryPartResponse.data.map(part => this.toEntityFromResource(part));
    }

    static toEntityFromResource(resource: InventoryPartResource): InventoryPartEntity {
        if (!resource) {
            throw new Error('Resource is undefined or null');
        }

        return new InventoryPartEntity({
            id: resource._id,
            code: resource.code,
            name: resource.name,
            description: resource.description,
            current_stock: resource.current_stock || 0,
            min_stock: resource.min_stock || 0,
            unit_price: resource.unit_price || 0,
            stock_status: resource.stock_status || this.calculateStockStatus(resource.current_stock, resource.min_stock),
            last_restock: resource.last_restock || new Date().toISOString()
        });
    }

    static toResourceFromEntity(entity: InventoryPartEntity) {
        const now = new Date().toISOString();
        return {
            id: entity.id,
            code: entity.code,
            name: entity.name,
            description: entity.description,
            current_stock: entity.current_stock,
            min_stock: entity.min_stock,
            unit_price: entity.unit_price,
            stock_status: this.calculateStockStatus(entity.current_stock, entity.min_stock),
            last_restock: entity.last_restock || now
        };
    }

    static calculateStockStatus(current: number, minimum: number) {
        if (!current || current === 0) return "OUT_OF_STOCK";
        if (current < minimum) return "LOW";
        if (current === minimum) return "MEDIUM";
        return "OK";
    }
}

export function calculateStockStatus(current: number, minimum: number): string {
    if (!current || current === 0) return "OUT_OF_STOCK";
    if (current < minimum) return "LOW";
    if (current === minimum) return "MEDIUM";
    return "OK";
}

