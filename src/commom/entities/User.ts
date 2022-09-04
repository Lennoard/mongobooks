import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
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
