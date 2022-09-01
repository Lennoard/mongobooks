import { User } from "../../commom/entities/User";
import { UserRepository } from "../domain/UserRepository";
import { Db, Filter, MongoClient } from "mongodb";

export class UserRepositoryImpl implements UserRepository {
  private client: MongoClient;
  private db: Db;

  constructor() {
    const uri = "mongodb://localhost:27017";
    this.client = new MongoClient(uri);
    this.db = this.client.db("bookreading");
  }

  public async get(filter: Filter<User>): Promise<User | null> {
    return await this.getUsersCollection().findOne<User>(filter);
  }

  public async getBy(name?: String): Promise<User | null> {
    if (!name) return null;
    return await this.getUsersCollection().findOne<User>({ name: name });
  }

  public async insert(user: User): Promise<User | null> {
    let result = await this.getUsersCollection().insertOne(user);
    user._id = result.insertedId.toString();
    return user;
  }

  public async update(user: Partial<User>): Promise<void | null> {
    await this.getUsersCollection().updateOne({ _id: user._id }, user);
  }

  private getUsersCollection = () => {
    return this.db.collection<User>("users");
  };
}
