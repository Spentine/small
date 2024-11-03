import { filterWords } from "./filter.js";

function main() {
  const wordList = document.getElementById("wordList");
  const regexFilter = document.getElementById("regexFilter");
  const filterButton = document.getElementById("filterButton");
  
  const listProcessingMenu = document.getElementById("listProcessingMenu");
  const alphabetSortButton = document.getElementById("alphabetSortButton");
  const revAlphabetSortButton = document.getElementById("revAlphabetSortButton");
  const lengthSortButton = document.getElementById("lengthSortButton");
  const revLengthSortButton = document.getElementById("revLengthSortButton");
  
  const newlineSeparationButton = document.getElementById("newlineSeparationButton");
  const commaSeparationButton = document.getElementById("csvButton");
  const jsonButton = document.getElementById("jsonButton");
  const outputPresentationMenu = document.getElementById("outputPresentationMenu");
  
  const outputMenu = document.getElementById("outputMenu");
  const outputElement = document.getElementById("outputElement");
  
  var filtered = null;
  var output = null;
  
  function updateUI() {
    if (filtered === null || filtered.length === 0) {
      listProcessingMenu.classList.add("hidden");
      outputPresentationMenu.classList.add("hidden");
    } else {
      listProcessingMenu.classList.remove("hidden");
      outputPresentationMenu.classList.remove("hidden");
    }
    
    if (output === null || output.length === 0) {
      outputMenu.classList.add("hidden");
    } else {
      outputMenu.classList.remove("hidden");
    }
  }
  
  async function filterPressed() {
    filtered = await filterWords(regexFilter.value, wordList.value);
    console.log(filtered);
    updateUI();
  }
  
  async function outputPressed(type) {
    const outputFunctions = {
      "newlineSeparation": ((x) => (x.join("\n"))),
      "csv": ((x) => (x.join(","))),
      "json": ((x) => (JSON.stringify(x)))
    };
    output = outputFunctions[type](filtered);
    outputElement.innerText = output;
    updateUI();
  }
  
  async function sortList(type) {
    if (filtered === null || filtered.length === 0) return;
    const sortingFunctions = {
      "alphabet": ((a, b) => (a > b) ? 1 : -1),
      "revAlphabet": ((a, b) => (a > b) ? -1 : 1),
      "length": ((a, b) => (a.length - b.length)),
      "revLength": ((a, b) => (b.length - a.length)),
    };
    filtered.sort(sortingFunctions[type]);
    console.log(filtered);
  }
  
  filterButton.addEventListener("click", filterPressed);
  newlineSeparationButton.addEventListener("click", () => outputPressed("newlineSeparation"));
  commaSeparationButton.addEventListener("click", () => outputPressed("csv"));
  jsonButton.addEventListener("click", () => outputPressed("json"));
  alphabetSortButton.addEventListener("click", () => sortList("alphabet"));
  revAlphabetSortButton.addEventListener("click", () => sortList("revAlphabet"));
  lengthSortButton.addEventListener("click", () => sortList("length"));
  revLengthSortButton.addEventListener("click", () => sortList("revLength"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}