function main() {
  const corpusLink = document.getElementById("corpusLink");
  const loadCorpusButton = document.getElementById("loadCorpusButton");
  const textareaInput = document.getElementById("textareaInput");
  const highlightedText = document.getElementById("highlightedText");
  
  let corpus = {};
  loadCorpus();
  
  async function loadCorpus() {
    console.log("Loading corpus from:", corpusLink.value);
    const response = await fetch(corpusLink.value);
    const text = await response.text();
    corpus = text.split("\n").map(word => word.trim()).filter(word => word.length > 0);
    
    // convert corpus to map
    corpus = new Map(corpus.map((word, index) => [word.toLowerCase(), index]));
    
    console.log("Corpus loaded:", corpus);
  }

  function createInputHandler() {
    let lastKeystroke = 0;
    const delay = 300; // milliseconds
    const buffer = 10; // milliseconds
    
    async function setText(e) {
      lastKeystroke = Date.now();
      
      // short text, highlight immediately
      if (textareaInput.value.length < 10000) {
        highlightedText.innerHTML = await highlightText(textareaInput.value);
      } else {
        // long text, wait for user to stop typing
        setTimeout(async () => {
          const timeSinceLastKeystroke = Date.now() - lastKeystroke;
          if (timeSinceLastKeystroke >= delay) {
            highlightedText.innerHTML = await highlightText(textareaInput.value);
          }
        }, delay + buffer); // add a small buffer to ensure delay has passed
        
        highlightedText.textContent = textareaInput.value;
        if (textareaInput.value.endsWith("\n")) {
          highlightedText.innerHTML += "<br>";
        }
      }
    }
    
    textareaInput.addEventListener("input", setText);
  }
  
  async function highlightText(text) {
    // split text into words
    const words = text.split(/\b/);
    // highlight words found in corpus
    
    const highlightedWords = words.map(word => {
      const index = corpus.get(word.toLowerCase());
      if (index !== undefined) {
        const color = `hsl(${
          (
            Math.log(index + 10)
            - Math.log(10)
          ) * 36
        }, ${
          Math.min(
            80,
            (Math.sqrt(index) / 60) * 80
          )
        }%, 25%)`;
        
        return `<span style="background-color:${color}">${word}</span>`;
      } else {
        return word;
      }
    });
    
    let res = highlightedWords.join("");
    
    if (res.endsWith("\n")) {
      res += "<br>";
    }
    
    return res;
  }
  
  createInputHandler();
  loadCorpusButton.addEventListener("click", loadCorpus);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}