export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
}

export interface TokenPayload {
  sub: string; // user id
  username: string;
  roles: string[];
  exp: number;
  iat: number;
}
