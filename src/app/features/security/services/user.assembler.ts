import { UserEntity } from '../../../core/model/user.model';
import { UserResponse } from './user.response';

export class UserAssembler {
  static fromResponse(response: UserResponse): UserEntity {
    return {
      id: response.id,
      name: response.name,
      password: response.password,
      email: response.email,
      roles: response.roles,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at)
    };
  }

  static toResponse(entity: UserEntity): UserResponse {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      roles: entity.roles,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString()
    };
  }
}
