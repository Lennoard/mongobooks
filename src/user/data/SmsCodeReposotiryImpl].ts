import { Db, Filter, MongoClient } from "mongodb";
import { UserCode } from "../../commom/entities/UserCode";
import { UserCodeRepository } from "../domain/UserCodeRepository";

export class SmsCodeReposotoryImpl implements UserCodeRepository {
  private client: MongoClient;
  private db: Db;

  constructor() {
    const uri = "mongodb://localhost:27017";
    this.client = new MongoClient(uri);
    this.db = this.client.db("bookreading");
  }

  async get(filter: Filter<UserCode>): Promise<UserCode | null> {
    return await this.getCollection().findOne<UserCode>(filter);
  }
  async insert(code: UserCode): Promise<UserCode | null> {
    let result = await this.getCollection().insertOne(code);
    code.id = result.insertedId.toString();
    return code;
  }

  private getCollection = () => {
    return this.db.collection<UserCode>("smscodes");
  };
}
