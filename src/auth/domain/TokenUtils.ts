import { User } from "../../commom/entities/User";

import jwt from "jsonwebtoken";

export class TokenUtils {
  private jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";
  
  public generate(user: User, expiresIn: string): string {
    return jwt.sign(user, this.jwtSecretKey, {
      expiresIn: expiresIn,
    });
  }

  public verify(
    refreshToken: string,
    callback: jwt.VerifyCallback<string | jwt.JwtPayload> | undefined
  ) {
    jwt.verify(refreshToken, this.jwtSecretKey, callback);
  }
}
