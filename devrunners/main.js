// wtf is this

import { greatness, randomChars } from "./distraction.js";

function main() {
  const startButton = document.getElementById("startButton");
  const startMenu = document.getElementById("startMenu");
  const gameContainer = document.getElementById("gameContainer");
  const holyText = document.getElementById("holyText");
  const salmonContainer = document.getElementById("salmonContainer");
  const salmonArray = [];
  const pointsDisplay = document.getElementById("pointsDisplay");
  var points = 0;
  var lastSpawn = 0;
  
  startMenu.style.display = "block";
  
  function updatePoints() {
    pointsDisplay.innerText = points + " POINTS!!!!";
  }
  
  function createSalmon() {
    const salmon = document.createElement("img");
    salmon.src = "salmon.png";
    const xPos = Math.random() * (window.innerWidth - 50) - 100;
    salmon.style.left = xPos + "px";
    var index = salmonArray.indexOf(null);
    const salmonData = {
      "salmon": salmon,
      "timeCreated": Date.now(),
      "xPos": xPos,
    }
    if (index === -1) {
      index = salmonArray.length;
      salmonArray.push(salmonData);
    } else {
      salmonArray[index] = salmonData;
    }
    salmon.classList.add("salmon");
    salmonContainer.appendChild(salmon);
    
    const nah = function() {
      points = Math.max(0, points - 1); // noo points
      salmon.remove();
      salmonArray[index] = null;
      updatePoints();
    }
    
    salmonData.nah = nah;
    
    salmon.addEventListener("mouseover", function () {
      points += 5; // wow points
      console.log(`points: ${points}`);
      salmon.remove();
      salmonArray[index] = null;
      updatePoints();
    });
  }
  
  function tick() {
    for (let i=0; i<salmonArray.length; i++) {
      if (salmonArray[i] !== null) {
        const timeCreated = salmonArray[i].timeCreated;
        const top = (Date.now() - timeCreated) * 0.5;
        if (top > 2000) {
          salmonArray[i].nah();
        } else {
          salmonArray[i].salmon.style.top = top + "px";
        }
      }
    }
    
    if (lastSpawn < Date.now() - 200) {
      createSalmon();
      lastSpawn = Date.now();
    }
    
    holyText.style.top = (100 * Math.sin(Date.now() / 100) - 200) + "px";
    holyText.style.left = (100 * Math.sin(Date.now() / 80) - 100) + "px";
    
    window.requestAnimationFrame(tick);
  }
  
  function startGame() {
    lastSpawn = Date.now();
    points = 0;
    updatePoints();
    startMenu.style.display = "none";
    gameContainer.style.display = "block";
    holyText.innerText = greatness();
    window.requestAnimationFrame(tick);
    
    const asmr = new Audio("quranASMR.m4a");
    asmr.play();
    const asmr2 = new Audio("quranASMR2.m4a");
    asmr2.play();
  }
  
  startButton.addEventListener("click", startGame);
  /*
  document.addEventListener("keydown", () => {
    createSalmon();
  });
  */
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}