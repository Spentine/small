function main() {
  const readClipboardButton = document.getElementById("readClipboardButton");
  const clipboardData = document.getElementById("clipboardData");
  
  async function readClipboard() {
    const clipboardItems = await navigator.clipboard.read();
    
    console.log(clipboardItems);
    const data = [];
    
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        const currentBlob = {};
        
        currentBlob.type = type;
        currentBlob.text = await blob.text();
        currentBlob.blob = blob;
        
        data.push(currentBlob);
      }
    }
    
    console.log(data);
    displayReadClipboard(data);
  }
  
  async function displayReadClipboard(data) {
    // remove all elements in clipboardData
    while (clipboardData.firstChild) {
      clipboardData.removeChild(clipboardData.firstChild);
    }
    
    for (let item of data) {
      const div = document.createElement("div");
      const p = document.createElement("p");
      
      p.textContent = item.type;
      
      const textTypes = ["text/plain", "text/html", "text/rtf"];
      const imageTypes = ["image/png", "image/jpeg", "image/gif"];
      
      div.appendChild(p);
      
      if (textTypes.includes(item.type)) {
        const preLike = document.createElement("p");
        preLike.classList.add("preLike");
        
        preLike.textContent = item.text;
        
        div.appendChild(preLike); 
      } else if (imageTypes.includes(item.type)) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(item.blob);
        img.alt = item.type;
        
        div.appendChild(img);
      }
      
      if (item.type === "text/html") {
        const htmlDisplay = document.createElement("div");
        htmlDisplay.classList.add("htmlDisplay");
        
        htmlDisplay.innerHTML = item.text;
        
        div.appendChild(htmlDisplay);
      }
      
      div.classList.add("dataContainer");
      clipboardData.appendChild(div);
    }
  }
  
  async function writeToClipboard() {
    
  }
  
  readClipboardButton.addEventListener("click", readClipboard);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}