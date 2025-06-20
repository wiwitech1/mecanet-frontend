export interface UserSession {
  userId: string;
  token: string; // Token de autenticación
  expiration: Date; // Fecha de expiración del token
  roles: string[]; // Roles del usuario
  name: string; // Nombre del usuario
  username: string; // Username del usuario
  // Agrega más campos según sea necesario
}
