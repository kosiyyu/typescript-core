import { MongoClient, clientOptions, CollectionOptions, Collection, Document, ObjectId, DbOptions } from "npm:mongodb";

class Uri {
  private readonly uri: string;

  constructor(protocol: string, cridentials: string, hostnamePort: string, options?: string) {
    if(protocol && cridentials && hostnamePort) {
      if(options) {
        this.uri = `${protocol}://${cridentials}@${hostnamePort}/${options}`;
      } else {
        this.uri = `${protocol}://${cridentials}@${hostnamePort}`;
      }
    } else {
      throw new Error("Uri | Uri parameters are incorrect.");
    }
  }

  public get(): string | undefined {
    return this.uri;
  }
}

class Client<T extends Document = Document> {
  private readonly uri: string;
  private readonly client: MongoClient;
  public readonly databaseName: string;
  public readonly collectionName: string;
  private readonly dbOptions?: DbOptions
  private readonly collectionOptions?: CollectionOptions

  constructor(uri: Uri, databaseName: string, collectionName: string, mongoClientOptions?: clientOptions, dbOptions?: DbOptions, collectionOptions?: CollectionOptions) {
    const uriString = uri.get();

    if(uriString) {
      this.uri = uriString;
    } else {
      throw new Error("Client | Uri string is incorrect.");
    }

    if(databaseName) {
      this.databaseName = databaseName;
    } else {
      throw new Error("Client | Database name is incorrect.");
    }

    if(collectionName) {
      this.collectionName = collectionName;
    } else {
      throw new Error("Client | Collection name is incorrect.");
    }

    this.dbOptions = dbOptions;
    this.collectionOptions = collectionOptions;

    const client = new MongoClient(this.uri, mongoClientOptions);
    if(client) {
      this.client = client;
    } else {
      throw new Error("Client | Client is incorrect.");
    }
  }

  public getCollection(): Collection<T> {
    return this.client.db(this.databaseName, this.dbOptions).collection(this.collectionName, this.collectionOptions);
  }

  public async testConnection() {
    try {
      await this.client.db(this.databaseName).command({ ping: 1 });
      console.log("Client | Success.");
    } finally {
      await this.client.close();
    }
  }
}

interface User {
  _id: ObjectId,
  email: string,
  password: string
}

const client = new Client<User>(
  new Uri("mongodb", "root:password", "localhost:27017"),
  "db",
  "test"
  );


client.testConnection();
client.getCollection().countDocuments().then(res => console.log(res.toString()));
