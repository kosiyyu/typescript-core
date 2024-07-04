export type DummyType = "START" | "OPTION A" | "OPTION B" | "OPTION C" | "END" | "ERROR";

export class Monad<T> {
    private readonly value: T;

    constructor(value: T) {
        this.value = value;
        console.log(`Monad initialized with value: ${this.value}`)
    }

    public bind(value: T) {
        if(value) {
            console.log(`Monad binded with value: ${value}`)
            return this;
        }
        return new Monad("ERROR");
    }
}

export const monad = new Monad("START");
monad.bind("OPTION A")
  .bind("OPTION B")
  .bind("OPTION C")
  .bind("END");