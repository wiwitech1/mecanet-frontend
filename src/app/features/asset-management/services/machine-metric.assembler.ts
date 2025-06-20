import { MachineMetricEntity } from '../models/machine-metric.entity';
import { MachineMetricResource } from './machine-metric.resource';

export class MachineMetricAssembler {
  
  static resourceToEntity(resource: MachineMetricResource): MachineMetricEntity {
    return {
      metricId: resource.metricId,
      metricName: resource.metricName,
      unit: resource.unit,
      value: resource.value,
      measuredAt: new Date(resource.measuredAt),
    };
  }

  static resourcesToEntities(resources: MachineMetricResource[]): MachineMetricEntity[] {
    return resources.map(resource => this.resourceToEntity(resource));
  }
} 