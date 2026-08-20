export interface Utente {
  id: number;
  username?: string | null;
  email?: string | null;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}