export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  // La API JWT no devuelve información del usuario directamente
  // Tendremos que decodificar el token para obtener esa información
}

export interface TokenPayload {
  sub: string; // user id
  username: string;
  roles: string[];
  exp: number;
  iat: number;
}
