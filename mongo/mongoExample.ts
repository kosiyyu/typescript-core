import { ObjectId } from "npm:mongodb";
import { MongoProvider, MongoUri } from "./mongo.ts";

interface User {
  _id?: ObjectId,
  email: string,
  password: string
}

const provider = new MongoProvider<User>(
  new MongoUri("mongodb", "root", "password", "localhost", 27017),
  "db",
  "test"
);

provider.testConnection();

provider.getCollectionTransaction(async (collection) => {
  const count = await collection.countDocuments();
  console.log(`Document count: ${count}.`);
});