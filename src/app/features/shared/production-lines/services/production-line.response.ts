import { MachineryResponse } from "../../machinery/services/machinery.response";

export interface ProductionLineResponse {
    id: number;
    plant_id: number;
    name: string;
    capacity: number;
    status: number;
    description: string;
    created_at: string;
    updated_at: string;
    machineries: MachineryResponse[];
  }