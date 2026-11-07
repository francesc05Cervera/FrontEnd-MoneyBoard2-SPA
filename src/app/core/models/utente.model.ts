export interface Utente {
  id: number;
  email: string;
  username?: string | null;
}

/** POST /api2/user/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Risposta di POST /api2/user/login */
export interface LoginResponse {
  token: string;
}

/** POST /api2/user/register */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/** Risposta di POST /api2/user/register */
export interface RegisterResponse {
  message: string;
}
