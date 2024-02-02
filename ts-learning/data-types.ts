console.log('Data Types in TypeScript');

type invalid = null | undefined;

let str: string = "hello world";
let str1: string = "wowowowo";
let isOk: boolean = true;
let num: number = 1;

let result = "";
result += str + str1 + num;

console.log(result);