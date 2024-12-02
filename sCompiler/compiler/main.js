import { SAsm } from "../sAsm.js";

function main() {
  console.log("hi");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}