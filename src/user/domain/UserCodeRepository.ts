import { Filter } from "mongodb";
import { UserCode } from "../../commom/entities/UserCode";

export interface UserCodeRepository {
  get(filter: Filter<UserCode>): Promise<UserCode | null>;
  insert(code: UserCode): Promise<UserCode | null>;
  //  update(user: Partial<UserCode>): Promise<void | null>;
}
