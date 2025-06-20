export interface UserEntity {
  id: string;
  name: string;
  email: string;
  username: string; // Username del usuario
  password: string;
  roles: string[]; // Lista de roles del usuario
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Fecha de última actualización
  route?: string; // Ruta del perfil del usuario
  // Puedes agregar más campos según sea necesario
}
