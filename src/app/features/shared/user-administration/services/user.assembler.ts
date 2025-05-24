import { UserResponse, UserResource } from "./user.response";
import { UserEntity } from "../model/user.entity";

export class UserAssembler {
    static toEntitiesFromResponse(response: UserResponse) {
        if (!response.data) {
            console.error("Respuesta inesperada:", response);
            return [];
        }

        const userResponse = new UserResponse(response.data);
        return userResponse.data.map(user => this.toEntityFromResource(user));
    }

    static toEntityFromResource(resource: UserResource) {
        if (!resource) {
            throw new Error('Resource is undefined or null');
        }

        return new UserEntity({
            id: resource._id,
            name: resource.name,
            password: resource.password,
            email: resource.email,
            ruc: resource.ruc,
            roles: resource.roles,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt
        });
    }
}
