import { Schema, Kvcol } from "./kvcol.ts"

class MyClass extends Schema {
  height!: number;
  birthday!: Date;
}

const db = new Kvcol(MyClass);

db.addRow({ height: 177, birthday: new Date("2000-01-01") });
db.addRow({ height: 180, birthday: new Date("1995-05-15") });
db.addRow({ height: 165, birthday: new Date("1988-11-30") });
db.addRow({ height: 172, birthday: new Date("2002-09-20") });
db.addRow({ height: 185, birthday: new Date("1990-03-10") });

const id = db.pipeline()
  .getColumnByName("height")
  .value()
  .get(177) as string;

const pipe = db.pipeline()
  .getRowByIdentifier(id)
  .value();

console.log(pipe);

const pipe2 = db.pipeline()
  .getColumnByName("height")
  .value();

console.log(pipe2);