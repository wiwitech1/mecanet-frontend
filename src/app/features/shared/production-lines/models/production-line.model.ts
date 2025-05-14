import { Machinery } from "../../machinery/models/machinery.model";

export interface ProductionLine {
    id: number;
    plant_id: number;
    name: string;
    capacity: number;
    status: number;
    description: string;
    created_at: string;
    updated_at: string;
    machineries: Machinery[];
  }