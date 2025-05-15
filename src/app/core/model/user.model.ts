export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: string[]; // Lista de roles del usuario
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Fecha de última actualización
  // Puedes agregar más campos según sea necesario
}
