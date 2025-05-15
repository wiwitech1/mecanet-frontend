import { PurchaseOrderResponse, PurchaseOrderResource } from "./purchase-orders.response.js";
import { PurchaseOrderEntity } from "../models/purchase-orders.entity.js";

export class PurchaseOrderAssembler {
    static toEntitiesFromResponse(response: PurchaseOrderResponse) {
        if (!response.data) {
            console.error("Respuesta inesperada:", response);
            return [];
        }

        const purchaseOrderResponse = new PurchaseOrderResponse(response.data);
        return purchaseOrderResponse.data.map(order => this.toEntityFromResource(order));
    }

    static toEntityFromResource(resource: PurchaseOrderResource) {
        if (!resource) {
            throw new Error('Resource is undefined or null');
        }

        return new PurchaseOrderEntity({
            id: resource._id,
            inventory_part_id: resource.inventory_part_id,
            quantity: resource.quantity,
            price: resource.price,
            order_date: resource.order_date,
            received_date: resource.received_date,
            status: resource.status,
            user_id: resource.user_id
        });
    }
}
