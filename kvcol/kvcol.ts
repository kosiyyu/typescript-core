import { IdGenerator } from "../snowflake/snowflake.ts"

type Keys<T> = keyof T;

type Values<T> = T[keyof T];

export type Column<T> = Map<T, string>;

export type Row<T extends Record<string, unknown>> = Map<Keys<T>, Values<T>>;

export function getKeys<T extends object>(c: new () => T): Array<Keys<T>> {
  return Object.keys(new c()) as Array<Keys<T>>;
}

function isNullOrUndefined(arg: unknown): arg is unknown {
  return arg === null || arg === undefined;
}

export class Schema {
  id?: string;
  [key: string]: unknown;
}

export class Kvcol<T extends Record<string, unknown>> {
  private readonly columns: Map<Keys<T>, Column<Values<T>>>;
  private readonly rows: Map<string, Row<T>>;
  private readonly names: Array<Keys<T>>;
  private readonly idGen: IdGenerator;

  constructor(c: new () => T) {
    this.columns = new Map();
    this.rows = new Map();
    this.names = getKeys(c);
    this.idGen = new IdGenerator(1n, 1n);

    for (const name of this.names) {
      this.columns.set(name, new Map());
    }
  }

  private _countKeys(arg: object): number {
    let counter = 0;
    for (const _ in arg) {
      counter++;
    }
    return counter;
  }

  private _isKeyLengthCorrect(arg: object): boolean {
    return this.names.length === this._countKeys(arg);
  }

  addRow(arg: T): void {
    const id = this.idGen.nextInHex();

    (arg as Schema).id = id;
    if (!this._isKeyLengthCorrect(arg)) {
      console.error("Incorrect object format.");
      return;
    }

    const newRow: Row<T> = new Map();

    for (const key in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, key)) {
        const value = arg[key];
        newRow.set(key, value);

        const column = this.getColumnByName(key);
        if (column) {
          column.set(value, id);
        } else {
          console.error(`Column '${key}' does not exist.`);
        }
      }
    }

    this.rows.set(id, newRow);
  }

  getRowByIdentifier(id: string): Row<T> {
    const result = this.rows.get(id);
    if (!isNullOrUndefined(result)) {
      return result;
    }
    throw new Error(`${this.constructor.name} - Row of id ${name} do not exist`);
  }

  getAllRows(): Map<string, Row<T>> {
    return this.rows;
  }

  getColumnByName(name: string): Column<Values<T>> {
    const result = this.columns.get(name);
    if (!isNullOrUndefined(result)) {
      return result;
    }
    throw new Error(`${this.constructor.name} - Column ${name} do not exist`);
  }

  getAllColumns(): Map<Keys<T>, Column<Values<T>>> {
    return this.columns;
  }

  pipeline(): Pipeline<T> {
    return new Pipeline(this);
  }
}

class Pipeline<T extends Record<string, unknown>> {
  private readonly kvcol: Kvcol<T>;

  constructor(kvcol: Kvcol<T>) {
    this.kvcol = kvcol;
  }

  getColumnByName(columnName: string): ColumnHandler<T> {
    return new ColumnHandler<T>(this.kvcol.getColumnByName(columnName));
  }

  getRowByIdentifier(id: string): RowHandler<T> {
    const result = this.kvcol.getRowByIdentifier(id);
    if (!isNullOrUndefined(result)) {
      return new RowHandler<T>(this.kvcol.getRowByIdentifier(id));
    }
    throw Error(`${this.constructor.name} - Row of ${id} do not exist`);
  }
}

class ColumnHandler<T extends Record<string, unknown>> {
  private readonly val: Column<Values<T>>;

  constructor(value: Column<Values<T>>) {
    this.val = value;
  }

  public value(): Column<Values<T>> {
    return this.val;
  }
}

export class RowHandler<T extends Record<string, unknown>> {
  private readonly val: Row<T>;

  constructor(val: Row<T>) {
    this.val = val;
  }

  value(): T {
    return Object.fromEntries(this.val) as T;
  }
}