export class UserEntity {
  id!: number;
  name!: string;
  password!: string;
  email!: string;
  ruc!: string;
  roles: string[] = [];
  createdAt!: string;
  updatedAt!: string;


  constructor({
      id = 0,
      name = '',
      password = '',
      email = '',
      ruc = '',
      roles = [] as string[],
      createdAt = '',
      updatedAt = ''
  }) {
      this.id = id;
      this.name = name;
      this.password = password;
      this.email = email;
      this.ruc = ruc;
      this.roles = roles;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
  }
}


