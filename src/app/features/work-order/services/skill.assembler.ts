import { SkillEntity } from '../models/skill.entity';
import { SkillResource } from './skill.resource';

/**
 * Clase responsable de transformar entre entidades de habilidades y recursos de la API
 */
export class SkillAssembler {

  /**
   * Convierte un recurso de la API a una entidad
   */
  static resourceToEntity(resource: SkillResource): SkillEntity {
    return {
      id: resource.id,
      name: resource.name,
      description: resource.description
    };
  }

  /**
   * Convierte múltiples recursos a entidades
   */
  static resourcesToEntities(resources: SkillResource[]): SkillEntity[] {
    return resources.map(resource => this.resourceToEntity(resource));
  }
} 