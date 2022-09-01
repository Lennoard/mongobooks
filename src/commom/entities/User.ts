export interface User {
  id?: string;
  name: string;
  login: string;
  email: string;
  password: string;
  active: boolean;
  phoneNumber?: number;

  tokenGenerationTime?: number;
  refreshToken?: string;
}
