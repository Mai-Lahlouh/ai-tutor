export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ApiResponse {
  error?: string;
  message?: string;
  token?: string;
}