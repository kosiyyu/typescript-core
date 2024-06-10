import { MongoClient, ClientSession, clientOptions, CollectionOptions, Collection, Document, ObjectId, DbOptions } from "npm:mongodb";

class Uri {
  private readonly uri: string;

  constructor(protocol: string, cridentials: string, hostnamePort: string, options?: string[]) {
    if (protocol && cridentials && hostnamePort) {
      this.uri = `${protocol}://${cridentials}@${hostnamePort}`;
      if (options && options.length > 0) {
        this.uri += `/?${options.join('&')}`;
      } else {
        this.uri = `${protocol}://${cridentials}@${hostnamePort}`;
      }
    } else {
      throw new Error("Uri | Uri parameters are incorrect.");
    }
    // console.log(this.uri);
  }

  public get(): string | undefined {
    return this.uri;
  }
}

class Client<T extends Document = Document> {
  private readonly uri: string;

  public readonly client: MongoClient;
  public readonly databaseName: string;
  public readonly collectionName: string;

  private readonly dbOptions?: DbOptions
  private readonly collectionOptions?: CollectionOptions

  constructor(
    uri: Uri,
    databaseName: string,
    collectionName: string,
    mongoClientOptions?: clientOptions,
    dbOptions?: DbOptions,
    collectionOptions?: CollectionOptions
  ) {
    const uriString = uri.get();
    if (!uriString) {
      throw new Error("Client | Uri string is incorrect.");
    }
    this.uri = uriString;

    if (!databaseName) {
      throw new Error("Client | Database name is incorrect.");
    }
    this.databaseName = databaseName;

    if (!collectionName) {
      throw new Error("Client | Collection name is incorrect.");
    }
    this.collectionName = collectionName;

    this.client = new MongoClient(this.uri, mongoClientOptions);
    this.dbOptions = dbOptions;
    this.collectionOptions = collectionOptions;
  }

  public getCollection(): Collection<T> {
    return this.client.db(this.databaseName, this.dbOptions).collection(this.collectionName, this.collectionOptions);
  }

  public async getCollectionTransaction(func: (collection: Collection<T>, session?: ClientSession) => Promise<void>): Promise<void> {
    const session = this.client.startSession();
    // console.log("Session started.");
    try {
      await session.withTransaction(async () => {
        // console.log("Transaction performed.");
        const collection = this.getCollection();
        await func(collection, session);
      });
    } finally {
      await session.endSession();
      // console.log("Session ended.");
    }
  }

  public async testConnection() {
    try {
      await this.client.db(this.databaseName).command({ ping: 1 });
      console.log("Client | Success.");
    } catch (e) {
      throw e;
    } finally {
      await this.client.close();
    }
  }
}

interface User {
  _id?: ObjectId,
  email: string,
  password: string
}

const client = new Client<User>(
  new Uri("mongodb", "root:password", "localhost:27017"),
  "db",
  "test"
);

client.testConnection();

client.getCollectionTransaction(async (collection) => {
  const count = await collection.countDocuments();
  console.log(`Document count: ${count}.`);
});




