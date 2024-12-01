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
  
  async interpret(outputCallback, inputCallback) {
    let codeIndex = 0;
    const variables = [];
    
    const modifyVar = function(x) {
      variables[this.program[codeIndex+1]] = x;
    }
    
    while (true) {
      switch (this.program[codeIndex]) {
        case 1: { // set
          modifyVar(this.program[codeIndex+2]);
          break;
        } case 2: { // add
          modifyVar(
            toNumber(variables[this.program[codeIndex+1]]) +
            toNumber(variables[this.program[codeIndex+2]])
          );
          break;
        } case 3: { // join
          modifyVar(
            String(variables[this.program[codeIndex+1]]) +
            String(variables[this.program[codeIndex+2]])
          );
          break;
        } case 4: { // char
          modifyVar(letterOf(
            String(variables[this.program[codeIndex+1]]),
            toNumber(variables[this.program[codeIndex+2]])
          ));
          break;
        } case 5: { // ascii
          modifyVar(String.fromCharCode(
            toNumber(variables[this.program[codeIndex+1]])
          ));
          break;
        } case 6: { // jump
          if (compare(
            variables[this.program[codeIndex+2]], 0
          ) > 0) {
            codeIndex = variables[this.program[codeIndex+1]];
            codeIndex -= 3; // offset the change at the end
          }
          break;
        } case 7: { // print
          outputCallback(
            variables[this.program[codeIndex+1]]
          );
          break;
        } case 8: { // input
          modifyVar(inputCallback());
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