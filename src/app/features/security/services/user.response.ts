export interface UserResponse {
  id: string;
  name: string;
  email: string;
  username: string; // Username del usuario
  roles: string[];
  password: string;
  created_at: string; // Fecha en formato string
  updated_at: string; // Fecha en formato string
  // Agrega otros campos según sea necesario
}
