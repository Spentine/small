const allowedKeys = [
  "Space", "KeyD", "KeyF"
];

const clicks = [];

var tapButton = null;
var resetButton = null;

var integerDisplay = null;
var decimalDisplay = null;
var rangeDisplay = null;
var countDisplay = null;

var decimalsInput = null;
var avgDiffInput = null;

var decimals = 3;
var avgDiff = 50;

function getDec(amount, decPlaces) {
  const integer = String(Math.floor(amount));
  var decimal = "";
  for (let i=0; i<decPlaces; i++) {
    amount %= 1;
    amount *= 10;
    decimal += String(Math.floor(amount));
  }
  return {"int": integer, "dec": decimal};
}

function calculate() {
  // bpm
  const bpm = ((clicks.length-1) / (clicks[clicks.length-1] - clicks[0])) * 60000;
  const increase = (((clicks.length-1) / ((clicks[clicks.length-1] - avgDiff) - clicks[0])) * 60000) - bpm;
  const decrease = bpm - (((clicks.length-1) / ((clicks[clicks.length-1] + avgDiff) - clicks[0])) * 60000);
  
  const bpmFormat = getDec(bpm, decimals);
  integerDisplay.innerHTML = bpmFormat.int;
  decimalDisplay.innerHTML = bpmFormat.dec;
  const rangeFormat = getDec((increase + decrease) / 2, decimals);
  rangeDisplay.innerHTML = "±" + rangeFormat.int + "." + rangeFormat.dec;
}

function render() {
  countDisplay.innerHTML = clicks.length;
  if (clicks.length <= 1) {
    integerDisplay.innerHTML = "---";
    decimalDisplay.innerHTML = "---";
    rangeDisplay.innerHTML = "±-.---";
    return;
  }
  calculate();
}

function tap() {
  clicks.push(Date.now()); // ms
  render();
}

function reset() {
  clicks.length = 0;
  render();
}

function editDecimals() {
  decimals = Number(decimalsInput.value);
  render();
}

function editAvgDiff() {
  avgDiff = Number(avgDiffInput.value);
  render();
}

function handleKeypress(event) {
  if (event.repeat) return;
  console.log(event);
  if (allowedKeys.includes(event.code)) {
    tap();
  }
}

function init() {
  tapButton = document.getElementById("bpmTap");
  resetButton = document.getElementById("reset");
  
  integerDisplay = document.getElementById("integer");
  decimalDisplay = document.getElementById("decimal");
  rangeDisplay = document.getElementById("range");
  countDisplay = document.getElementById("count");
  
  decimalsInput = document.getElementById("decimals");
  avgDiffInput = document.getElementById("avgDiff");
  
  // add interactions
  
  tapButton.addEventListener("click", tap);
  resetButton.addEventListener("click", reset);
  
  decimalsInput.addEventListener("change", editDecimals);
  avgDiffInput.addEventListener("change", editAvgDiff);
  
  document.addEventListener("keydown", handleKeypress);
  
  render();
}

document.addEventListener("DOMContentLoaded", init);