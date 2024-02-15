export interface InputErrors {
  username: boolean;
  password: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}
