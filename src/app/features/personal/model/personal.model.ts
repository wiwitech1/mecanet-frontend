export interface PersonalEntity {
  id?: number;
  username: string;
  name?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  roles: PersonalRole[];
}

export type PersonalRole = 'ROLE_TECHNICAL' | 'ROLE_ADMIN';
