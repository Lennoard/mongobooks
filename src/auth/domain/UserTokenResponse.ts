import { User } from "../../commom/entities/User";

export interface UserTokenResponse {
  user: User;
  accessToken: string;
  iat: number;
}
