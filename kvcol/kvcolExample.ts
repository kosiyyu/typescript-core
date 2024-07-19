import { Schema, Kvcol, Column } from "./kvcol.ts"

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

console.log(db.getColumnByName("height"));
const map: Column<unknown> | undefined = db.getColumnByName("height");
const id: string | undefined = map.get(177);
if(map && id){
  console.log(db.getRowByIdentifier(map?.get(177)));
}