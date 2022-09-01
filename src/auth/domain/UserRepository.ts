import { User } from "../../commom/entities/User";
import { Filter } from "mongodb";

export interface UserRepository {
  get(filter: Filter<User>): Promise<User | null>;
  getBy(qualifier: String): Promise<User | null>;
  insert(user: User): Promise<User | null>;
  update(user: Partial<User>): Promise<void | null>;
}
