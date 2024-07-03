type Column = Map<unknown, string>;

// Row is basically an object nameKeys: values
type Row = Map<string, unknown>;

function isNullOrUndefined(arg: unknown): boolean {
  return arg === null || arg === undefined;
}

class Kvcol {
  private readonly columns: Map<string, Column>;
  private readonly rows: Map<string, Row>;
  private rowCounter: number;
  private names: string[];

  constructor(names: string[]) {
    this.columns = new Map();
    this.rows = new Map();
    this.rowCounter = 0;
    this.names = names;

    for (const name of names) {
      this.columns.set(name, new Map());
    }
  }

  getColumnByName(name: string): Column | undefined {
    const result = this.columns.get(name);
    if (!isNullOrUndefined(result)) {
      return result;
    }
    return undefined;
  }

  private countKeys(arg: Object): number {
    let counter = 0;
    for (const _ in arg) {
      counter++;
    }
    return counter;
  }

  private isCorrect(arg: Object): boolean {
    return this.names.length === this.countKeys(arg); // add proper check
  }

  addRow(arg: Object): void {
    if (!this.isCorrect(arg)) {
      console.error("Incorrect object format.");
      return;
    }

    const newRow: Row = new Map();

    // Populate newRow with properties from arg
    for (const key in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, key)) {
        const value = arg[key];
        newRow.set(key, value);

        // Update columns map
        const column = this.getColumnByName(key);
        if (column) {
          column.set(value, this.rowCounter.toString());
        } else {
          console.error(`Column '${key}' does not exist.`);
        }
      }
    }

    this.rows.set(this.rowCounter.toString(), newRow);
    this.rowCounter++;
  }

  getRowByIdentifier(arg: string): Row | undefined {
    return this.rows.get(arg)
  }
}

const db = new Kvcol(["id", "height", "birthday"]);

db.addRow({ id: "0", height: 177, birthday: new Date("2000-01-01") });
db.addRow({ id: "1", height: 180, birthday: new Date("1995-05-15") });
db.addRow({ id: "2", height: 165, birthday: new Date("1988-11-30") });
db.addRow({ id: "3", height: 172, birthday: new Date("2002-09-20") });
db.addRow({ id: "4", height: 185, birthday: new Date("1990-03-10") });

console.log(db.getColumnByName("height"));
console.log(db.getRowByIdentifier("0"));