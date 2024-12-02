// The class for the esoteric assembly language.

// Number Casting behavior
function toNumber(value) {
  if (typeof value === "number") {
    if (Number.isNaN(value)) return 0;
    return value;
  }
  const coerced = Number(value);
  if (Number.isNaN(coerced)) return 0;
  return coerced;
}

// Character Index
function letterOf(string, index) {
  const indexZ = toNumber(index) - 1; // zero-indexed
  const str = String(string);
  if (indexZ < 0 || indexZ >= str.length) {
    return "";
  }
  return str.charAt(indexZ);
}

// Whitespace Detection
function isWhiteSpace(val) {
  return (
    val === null ||
    (
      typeof val === 'string' &&
      val.trim().length === 0
    )
  );
}

// Comparison
function compare(v1, v2) {
  let n1 = Number(v1);
  let n2 = Number(v2);
  if (n1 === 0 && isWhiteSpace(v1)) {
    n1 = NaN;
  } else if (n2 === 0 && isWhiteSpace(v2)) {
    n2 = NaN;
  }
  if (isNaN(n1) || isNaN(n2)) {
    // case insensitive comparison
    const s1 = String(v1).toLowerCase();
    const s2 = String(v2).toLowerCase();
    if (s1 < s2) return -1;
    else if (s1 > s2) return 1;
    return 0;
  }
  if (
    (n1 === Infinity && n2 === Infinity) ||
    (n1 === -Infinity && n2 === -Infinity)
  ) {
    return 0;
  }
  return n1 - n2;
}

// Defines an instruction
class Inst {
  constructor(inst, arg1, arg2) {
    // type of instruction
    if (typeof inst === Number) {
      this.inst = inst;
    } else {
      this.inst = Inst.instMap[inst];
    }
    
    this.arg1 = arg1;
    this.arg2 = arg2;
  }
  
  toArray() {
    return [this.inst, this.arg1, this.arg2];
  }
  
  static instMap = {
    "set": 1,
    "add": 2,
    "join": 3,
    "char": 4,
    "ascii": 5,
    "jump": 6,
    "print": 7,
    "input": 8
  };
}

// Defines a program
class SAsm {
  constructor(program) {
    this.program = program;
  }
  
  sanitize() {
    for (let i=0; i<this.program.length; i++) {
      const n = Number(this.program[i]);
      if (!isNaN(n)) {
        this.program[i] = n;
      }
    }
  }
  
  async interpret(outputCallback, inputCallback) {
    let codeIndex = 0;
    const variables = this.program;
    
    const modifyVar = function(x) {
      variables[variables[codeIndex+1]-1] = x;
    }
    
    while (codeIndex < variables.length) {
      switch (variables[codeIndex]) {
        case 1: { // add
          modifyVar(
            toNumber(variables[variables[codeIndex+1]-1]) +
            toNumber(variables[variables[codeIndex+2]-1])
          );
          break;
        } case 2: { // join
          modifyVar(
            String(variables[variables[codeIndex+1]-1]) +
            String(variables[variables[codeIndex+2]-1])
          );
          break;
        } case 3: { // char
          modifyVar(letterOf(
            String(variables[variables[codeIndex+1]-1]),
            toNumber(variables[variables[codeIndex+2]-1])
          ));
          break;;
        } case 4: { // jump
          if (compare(
            variables[variables[codeIndex+2]-1], 0
          ) > 0) {
            codeIndex = variables[variables[codeIndex+1]-1] - 1;
          }
          break;
        } case 5: { // print
          await outputCallback(
            variables[variables[codeIndex+1]-1]
          );
          break;
        } case 6: { // input
          modifyVar(await inputCallback());
          break;
        } default: { // other
          // end the program
          return;
        }
      }
      
      // jump to next instruction
      codeIndex += 3;
    }
  }
}

export { SAsm };