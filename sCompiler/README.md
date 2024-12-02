# sCompiler

This project dates back to 2022 where I first conceptualized the language. What is the smallest amount of blocks required to create a Turing-Complete program in Scratch? Back then, I got it down to 67 blocks. Now, I made a few small modifications and got it down to 64 blocks.

I am approaching the assembly language again with increased skill and practice, so hopefully something reasonably complex can be created out of it.

# Assembly Language

- `1`: "add"
  - Arguments
    - `1`: address
    - `2`: address
  - Description
    - The operator will set the variable at address `1` to be the sum of the variable at address `1` and the variable at address `2`.
    - The variables will be casted to `Number`s before addition.
    
- `2`: "join"
  - Arguments
    - `1`: address
    - `2`: address
  - Description
    - The operator will set the variable at address `1` to be the concatenation of the variable at address `1` and the variable at address `2`.
    - The variables wlil be casted to `String`s before concatenation.
    
- `3`: "char"
  - Arguments
    - `1`: address
    - `2`: address
  - Description
    - The operator will set the variable at address `1` to be the character at (the index specified by the variable at address `2`) of the variable at address `1`.
    
- `4`: "jump"
  - Arguments
    - `1`: address
    - `2`: address
  - Description
    - If the variable at address `2` is greater than 0, set the current code pointer to the variable at address `1`.
    - Right after the jump statement, the index will then be incremented by 3.
    - To jump to a particular bit of code, jump to `index - 3`.
    
- `5`: "print"
  - Arguments
    - `1`: address
  - Description
    - Outputs the value of the variable at address `1` to the console.
    
- `6`: "input"
  - Arguments
    - `1`: address
  - Description
    - Overwrites the value at variable `1` with the user's character input.
  

# Variable Type Cast

## Number

`/scratch-vm/blob/develop/src/util/cast.js` Line 22
```js
static toNumber (value) {
  // If value is already a number we don't need to coerce it with
  // Number().
  if (typeof value === 'number') {
    // Scratch treats NaN as 0, when needed as a number.
    // E.g., 0 + NaN -> 0.
    if (Number.isNaN(value)) {
      return 0;
    }
    return value;
  }
  const n = Number(value);
  if (Number.isNaN(n)) {
    // Scratch treats NaN as 0, when needed as a number.
    // E.g., 0 + NaN -> 0.
    return 0;
  }
  return n;
}
```

## String

`/scratch-vm/blob/develop/src/util/cast.js` Line 73
```js
static toString (value) {
  return String(value);
}
```

## Scratch Operators

`/scratch-vm/blob/develop/src/util/cast.js` Line 121
```js
static compare (v1, v2) {
  let n1 = Number(v1);
  let n2 = Number(v2);
  if (n1 === 0 && Cast.isWhiteSpace(v1)) {
      n1 = NaN;
  } else if (n2 === 0 && Cast.isWhiteSpace(v2)) {
      n2 = NaN;
  }
  if (isNaN(n1) || isNaN(n2)) {
      // At least one argument can't be converted to a number.
      // Scratch compares strings as case insensitive.
      const s1 = String(v1).toLowerCase();
      const s2 = String(v2).toLowerCase();
      if (s1 < s2) {
          return -1;
      } else if (s1 > s2) {
          return 1;
      }
      return 0;
  }
  // Handle the special case of Infinity
  if (
      (n1 === Infinity && n2 === Infinity) ||
      (n1 === -Infinity && n2 === -Infinity)
  ) {
      return 0;
  }
  // Compare as numbers.
  return n1 - n2;
}
```

I lost internet when trying to cite.
```js
letterOf (args) {
  const index = Cast.toNumber(args.LETTER) - 1;
  const str = Cast.toString(args.STRING);
  // Out of bounds?
  if (index < 0 || index >= str.length) {
      return '';
  }
  return str.charAt(index);
}
```