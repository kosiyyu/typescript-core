import { ObjectId } from "npm:mongodb";
import { Client, Uri } from "./mongo.ts";

interface User {
  _id?: ObjectId,
  email: string,
  password: string
}

const client = new Client<User>(
  new Uri("mongodb1", "root", "password", "localhost", 27017),
  "db",
  "test"
);

client.testConnection();

client.getCollectionTransaction(async (collection) => {
  const count = await collection.countDocuments();
  console.log(`Document count: ${count}.`);
});