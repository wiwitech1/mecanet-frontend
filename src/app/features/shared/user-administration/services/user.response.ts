export class UserResource {
  _id: number;
  name: string;
  password: string;
  email: string;
  ruc: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  constructor({
      id = 0,
      name = '',
      password = '',
      email = '',
      ruc = '',
      roles = [],
      createdAt = '',
      updatedAt = ''
  } = {}) {
      this._id = id;
      this.name = name;
      this.password = password;
      this.email = email;
      this.ruc = ruc;
      this.roles = roles;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
  }
}

export class UserResponse {
  data: UserResource[];
  info: { count: number };

  constructor(data: UserResource[] = []) {
      this.data = data;
      this.info = {
          count: data.length
      };
  }
}
