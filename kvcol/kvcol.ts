import { IdGenerator } from "../snowflake/snowflake.ts"

export type Column<T> = Map<T, string>;

export type Row<T extends Record<string, unknown>> = Map<keyof T, T[keyof T]>;

export function getKeys<T extends object>(c: new () => T): Array<keyof T> {
  return Object.keys(new c()) as Array<keyof T> ;
}

function isNullOrUndefined(arg: unknown): boolean {
  return arg === null || arg === undefined;
}

export class Schema {
  id?: string;
  [key: string]: unknown;
}

export class Kvcol<T extends Record<string, unknown>> {
  private readonly columns: Map<keyof T, Column<T[keyof T]>>;
  private readonly rows: Map<string, Row<T>>;
  private readonly names: Array<keyof T> ;
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

  getColumnByName(name: string): Column<T[keyof T]> | undefined {
    const result = this.columns.get(name);
    if (!isNullOrUndefined(result)) {
      return result;
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
    (arg as Schema).id = this.idGen.nextInHex();
    if (!this._isKeyLengthCorrect(arg)) {
      console.error("Incorrect object format.");
      return;
    }

    const newRow: Row<T> = new Map();

    const id = this.idGen.nextInHex();

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

  getRowByIdentifier(arg: string): Row<T> | undefined {
    return this.rows.get(arg);
  }
}