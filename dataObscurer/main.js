class LehmerRNG {
  constructor(seed) {
    this.state = seed;
  }

  next() {
    this.state = (this.state * 48271) % 2147483647;
    return this.state;
  }
  
  nextFloat() {
    return this.next() / 2147483647;
  }
}

function shuffleArray(array, seed) {
  let m = array.length, t, i;
  const rng = new LehmerRNG(seed);
  const random = rng.nextFloat.bind(rng);
  while (m) {
    i = Math.floor(random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  
  return array;
}

function generateRandomNumbers(seed, inverted = false) {
  const numbers = Array.from({ length: 256 }, (_, i) => i);
  const shuffledNumbers = shuffleArray(numbers, seed);
  
  if (inverted) {
    const invertedNumbers = new Array(256);
    for (let i = 0; i < 256; i++) {
      invertedNumbers[shuffledNumbers[i]] = i;
    }
    return invertedNumbers; 
  }
  
  return shuffledNumbers;
}

function main() {
  const fileInput = document.getElementById("fileInput");
  const processFiles = document.getElementById("processFiles");
  
  const seedInput = document.getElementById("seedInput");
  const invertedInput = document.getElementById("invertedInput");
  
  processFiles.addEventListener("click", () => {
    const randomNumbers = generateRandomNumbers(parseInt(seedInput.value), invertedInput.checked);
    console.log(randomNumbers);
    
    const files = fileInput.files;
    if (files.length === 0) {
      alert("Please select a file to obscure.");
      return;
    }
    
    const file = files[0];
    
    const reader = new FileReader();
    
    // to array buffer
    
    reader.readAsArrayBuffer(file);
    
    reader.onload = function(event) {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log(uint8Array);
      
      // for each item in the uint8array, replace it with the random number at that index
      for (let i = 0; i < uint8Array.length; i++) {
        uint8Array[i] = randomNumbers[uint8Array[i]];
      }
      
      // create a new blob with the modified data
      const blob = new Blob([uint8Array], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `obscured_${file.name}`;
      
      // trigger the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}