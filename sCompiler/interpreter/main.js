import { SAsm } from "../sAsm.js";

function main() {
  const programArea = document.getElementById("programArea");
  const executeProgramButton = document.getElementById("executeProgramButton");
  
  const programOutputArea = document.getElementById("programOutputArea");
  
  function inputIn() {
    return prompt("Input");
  }
  
  function writeOut(text) {
    console.log(text);
    programOutputArea.innerText += text + "\n";
  }
  
  function executeProgram() {
    programOutputArea.innerText = "";
    const asm = new SAsm(programArea.value.split("\n"));
    asm.sanitize();
    console.log("Program", asm.program);
    
    asm.interpret(writeOut, inputIn);
  }
  
  executeProgramButton.addEventListener("click", executeProgram);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}