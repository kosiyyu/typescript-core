const names: string[] = ["id", "height", "birthday"] as const;

type MyType = {
  id: string,
  height: number,
  birthday: Date
}

let rowCounter = 0;

// Column is a map of value: identifier
type Column = Map<unknown, string>;

// Row is basically an object nameKeys: values
type Row = Map<string, unknown>;

const columns: Map<string, Column> = new Map();
const rows: Map<string, Row> = new Map();

// Initialize columns with empty Maps for each name
for (const name of names) {
  columns.set(name, new Map());
}

function isNullOrUndefined(arg: unknown): boolean {
  return arg === null || arg === undefined;
}

function getColumnByName(name: string): Column | undefined {
  const result = columns.get(name);
  if (!isNullOrUndefined(result)) {
    return result;
  }
  return undefined;
}

function countKeys(arg: Object): number {
  let counter = 0;
  for (const _ in arg) {
    counter++;
  }
  return counter;
}

function isCorrect(arg: Object): boolean {
  return names.length === countKeys(arg); // add proper check
}

function addRow(arg: MyType): void {
  if (!isCorrect(arg)) {
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
      const column = getColumnByName(key);
      if (column) {
        column.set(value, rowCounter.toString());
      } else {
        console.error(`Column '${key}' does not exist.`);
      }
    }
  }

  rows.set(rowCounter.toString(), newRow);
  rowCounter++;
}

function getRowByIdentifier(arg: string): Row | undefined {
  return rows.get(arg)
}


addRow({ id: "0", height: 177, birthday: new Date("2000-01-01") });
addRow({ id: "1", height: 180, birthday: new Date("1995-05-15") });
addRow({ id: "2", height: 165, birthday: new Date("1988-11-30") });
addRow({ id: "3", height: 172, birthday: new Date("2002-09-20") });
addRow({ id: "4", height: 185, birthday: new Date("1990-03-10") });

console.log(getColumnByName("height"));
console.log(getRowByIdentifier("0"));
