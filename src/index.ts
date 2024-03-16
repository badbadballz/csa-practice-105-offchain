// putStrLn
console.log("hello");
console.log("testing");

// Haskell type using Opaque types, symbol javascript
// unknown -> api server (no controll side effects)

// inputs                 , output
// (a: number, b: string) => ({....})
// () => ({}) lambda function

// Haskell
// Maybe sort of optional - Just something, Nothing

//Haskell sum type
// Typescript union type
type X = {
  a: string;
};
type Y = {
  b: string;
};
type XY = X | Y;

const r: XY = { a: "a", b: "x" }; // Valid

const x: string = "2";
const y: string = "y";
const isReady: boolean = true;

const decimal: number = 10;
const hexadecimal: number = 0xa00d; // Hexadecimal starts with 0x
const binary: number = 0b1010; // Binary starts with 0b
const octal: number = 0o633; // Octal starts with 0o

const x1: bigint = BigInt(decimal); // Data I
const y1: bigint = 9007199254740991n;

const x2: string[] = ["a", "b"];
console.log(x2);
const y2: Array<string> = ["a", "b"];
const j: Array<string | number> = ["a", 1, "b", 2]; // Union
x2.push("c");
console.log(x2);

const x3: readonly string[] = ["a", "b"]; // Readonly modifier
const y3: ReadonlyArray<string> = ["a", "b"];
const j3: ReadonlyArray<string | number> = ["a", 1, "b", 2];

//j3.push("x"); // Invalid
console.log(j3);

function sum1(a: number, b: number) {
  return a + b;
}
console.log(sum1(1,2))

const sum2 = (a: number, b: number) => a + b;
console.log(sum2(1,2))

const sum3 = (a = 10, b: number): number => a + b;
console.log(sum3(undefined,2))

type A = {
  a: number;
};
type B = {
  b: number;
};
type C = A & B;
type D = A | B


const fn = (x: number | string) => {
  if (typeof x === 'number') {
      return x + 1; // x is number
  }
  return -1;
};
console.log(fn(2))
console.log(fn("sadada"))

const toUpperCase = (name: string | null) => {
  if (name) {
      return name.toUpperCase();
  } else {
      return null;
  }
};

console.log(toUpperCase("sss"))
console.log(toUpperCase(null))

const checkStatus = (status: 'success' | 'error') => {
  switch (status) {
      case 'success':
          return true;
      case 'error':
          return null;
  }
};

console.log(checkStatus("success"))
console.log(checkStatus("error"))


type Dog = {
  name: string;
  breed: string;
};

type Cat = {
  name: string;
  likesCream: boolean;
};

const getAnimalType = (pet: Dog | Cat) => {
  if ('breed' in pet) {
      return 'dog';
  } else {
      return 'cat';
  }
};
console.log(getAnimalType({name: "sdas", breed: "sdsd"}))



type Square = {
  kind: 'square'; // Discriminant
  size: number;
};

type Circle = {
  kind: 'circle'; // Discriminant
  radius: number;
};

type Shape = Square | Circle;

const area = (shape: Shape) => {
  switch (shape.kind) {
      case 'square':
          return Math.pow(shape.size, 2);
      case 'circle':
          return Math.PI * Math.pow(shape.radius, 2);
  }
};

const square: Square = { kind: 'square', size: 5 };
const circle: Circle = { kind: 'circle', radius: 2 };

console.log(area(square)); // 25
console.log(area(circle)); // 12.566370614359172