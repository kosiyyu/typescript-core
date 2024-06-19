import { MongoClient, ClientSession, clientOptions, CollectionOptions, Collection, Document, DbOptions } from "npm:mongodb";

export class MongoUri {
  private readonly uri: string;

  constructor(protocol: string, username: string, password: string, hostname: string, port: string | number, options?: string[]) {
    if (protocol && username && password && hostname && port) {
      if(protocol === "mongodb") {
        this.uri = `${protocol}://${username}:${password}@${hostname}:${port}`;
      } else if(protocol === "mongo+srv") {
        throw new Error(`${this.constructor.name} | Invalid constructor parameter: mongo+srv is not supported yet.`);
      } else {
        throw new Error(`${this.constructor.name} | Invalid constructor parameter: protocol is ${protocol} and should be mongodb or mongo+srv.`);
      }

      if (options && options.length > 0) {
        this.uri += `/?${options.join('&')}`;
      }
    } else {
      throw new Error(`${this.constructor.name} | Uri parameters are incorrect.`);
    }
  }

  public get(): string | undefined {
    return this.uri;
  }
}

export class MongoProvider<T extends Document = Document> {
  private readonly uri: string;

  public readonly client: MongoClient;
  public readonly databaseName: string;
  public readonly collectionName: string;

  private readonly dbOptions?: DbOptions
  private readonly collectionOptions?: CollectionOptions

  constructor(
    uri: MongoUri,
    databaseName: string,
    collectionName: string,
    mongoClientOptions?: clientOptions,
    dbOptions?: DbOptions,
    collectionOptions?: CollectionOptions
  ) {
    const uriString = uri.get();
    if (!uriString) {
      throw new Error(`${this.constructor.name} | Uri string is incorrect.`);
    }
    this.uri = uriString;

    if (!databaseName) {
      throw new Error(`${this.constructor.name} | Database name is incorrect.`);
    }
    this.databaseName = databaseName;

    if (!collectionName) {
      throw new Error(`${this.constructor.name} | Collection name is incorrect.`);
    }
    this.collectionName = collectionName;

    this.client = new MongoClient(this.uri, mongoClientOptions);
    this.dbOptions = dbOptions;
    this.collectionOptions = collectionOptions;
  }

  private getCollection(): Collection<T> {
    return this.client.db(this.databaseName, this.dbOptions).collection(this.collectionName, this.collectionOptions);
  }

  public async getCollectionTransaction(func: (collection: Collection<T>, session?: ClientSession) => Promise<void>): Promise<void> {
    const session = this.client.startSession();
    try {
      await session.withTransaction(async () => {
        const collection = this.getCollection();
        await func(collection, session);
      });
    } catch {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }

  public testConnection() {
    this.getCollectionTransaction(async (_collection) => {
      const response = await this.client.db(this.databaseName).command({ ping: 1 });
      if(response.ok && response.ok === 1) {
        console.log(`${this.constructor.name} | Success.`);
        return;
      }
      console.log(`${this.constructor.name} | Failure.`);
    });
  }
}