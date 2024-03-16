// putStrLn
console.log("hello");
console.log("testing");
const r = { a: "a", b: "x" }; // Valid
const x = "2";
const y = "y";
const isReady = true;
const decimal = 10;
const hexadecimal = 0xa00d; // Hexadecimal starts with 0x
const binary = 0b1010; // Binary starts with 0b
const octal = 0o633; // Octal starts with 0o
const x1 = BigInt(decimal); // Data I
const y1 = 9007199254740991n;
const x2 = ["a", "b"];
console.log(x2);
const y2 = ["a", "b"];
const j = ["a", 1, "b", 2]; // Union
x2.push("c");
console.log(x2);
const x3 = ["a", "b"]; // Readonly modifier
const y3 = ["a", "b"];
const j3 = ["a", 1, "b", 2];
//j3.push("x"); // Invalid
console.log(j3);
function sum1(a, b) {
    return a + b;
}
console.log(sum1(1, 2));
const sum2 = (a, b) => a + b;
console.log(sum2(1, 2));
const sum3 = (a = 10, b) => a + b;
console.log(sum3(undefined, 2));
const fn = (x) => {
    if (typeof x === 'number') {
        return x + 1; // x is number
    }
    return -1;
};
console.log(fn(2));
console.log(fn("sadada"));
const toUpperCase = (name) => {
    if (name) {
        return name.toUpperCase();
    }
    else {
        return null;
    }
};
console.log(toUpperCase("sss"));
console.log(toUpperCase(null));
const checkStatus = (status) => {
    switch (status) {
        case 'success':
            return true;
        case 'error':
            return null;
    }
};
console.log(checkStatus("success"));
console.log(checkStatus("error"));
const getAnimalType = (pet) => {
    if ('breed' in pet) {
        return 'dog';
    }
    else {
        return 'cat';
    }
};
console.log(getAnimalType({ name: "sdas", breed: "sdsd" }));
const area = (shape) => {
    switch (shape.kind) {
        case 'square':
            return Math.pow(shape.size, 2);
        case 'circle':
            return Math.PI * Math.pow(shape.radius, 2);
    }
};
const square = { kind: 'square', size: 5 };
const circle = { kind: 'circle', radius: 2 };
console.log(area(square)); // 25
console.log(area(circle)); // 12.566370614359172
export {};
