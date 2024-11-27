import { interpretCode } from "./code128.js";

function main() {
  const cameraData = document.getElementById("cameraData");
  const overlayElement = document.getElementById("overlayElement");
  const debugCanvases = document.getElementById("debugCanvases");
  const cTimeStampElement = document.getElementById("cTimeStampElement");
  const dataElement = document.getElementById("dataElement");
  
  // play video on camera
  function runCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        cameraData.srcObject = stream;
        cameraData.play();
        window.requestAnimationFrame(frame);
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
  }
  
  function canPlay(event) {
    console.log(event);
    
    overlayElement.width = event.target.videoWidth;
    overlayElement.height = event.target.videoHeight;
    
    console.log(overlayElement);
    
    const ctx = overlayElement.getContext("2d");
    ctx.fillStyle = "#ff0000";
    
    ctx.fillRect(0, (overlayElement.height >> 1) - 1, overlayElement.width, 2);
  }
  
  var lastFrame = null;
  function frame(event) {
    if (event === lastFrame) {
      // console.log("duplicate frame");
    } else {
      cTimeStampElement.innerText = event;
      
      const data = readBarcode(cameraData, cameraData.videoWidth, cameraData.videoHeight);
      // console.log(data);
    }
    
    lastFrame = event;
    cameraData.requestVideoFrameCallback(frame);
  }
  
  function readBarcode(img, w, h) {
    if (w === 0 || h === 0) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, w, h).data;
    
    while (debugCanvases.firstChild) {
      debugCanvases.removeChild(debugCanvases.lastChild);
    }
    
    const addToDebugCanvases = function(array, s) {
      const debugCanvas = document.createElement("canvas");
      const height = 25;
      debugCanvas.width = w;
      debugCanvas.height = height;
      const debugCtx = debugCanvas.getContext("2d");
      
      if ([0,1,3].includes(s.m)) {
        
        for (let i=0; i<array.length; i++) {
          switch (s.m) {
            case 0: {
              const v = array[i] * 255;
              debugCtx.fillStyle = `rgb(${v},${v},${v})`;
              break;
            } case 1: {
              const v = array[i];
              if (Math.abs(v) < s.toleranceDelta) {
                const dv = array[i] * 512 + 127;
                debugCtx.fillStyle = `rgb(${dv},${dv},${dv})`;
              } else {
                if (v > 0) {
                  debugCtx.fillStyle = "rgb(255, 255, 0)";
                } else {
                  debugCtx.fillStyle = "rgb(255, 0, 255)";
                }
              }
              break;
            } case 3: {
              const v = array[i];
              if (Math.abs(v) < s.toleranceDelta) {
                const dv = array[i] * 256 + 63;
                debugCtx.fillStyle = `rgb(${dv},${dv},${dv})`;
              } else {
                if (v > 0) {
                  debugCtx.fillStyle = "rgb(64, 64, 0)";
                } else {
                  debugCtx.fillStyle = "rgb(64, 0, 64)";
                }
              }
              break;
            }
          }
          debugCtx.fillRect(i, 0, 1, height); // make vertical line
        }
        
      }
      
      switch (s.m) {
        case 2: {
          for (let i of s.diffs) {
            const v = i.change
            if (v > 0) {
              debugCtx.fillStyle = "rgb(255, 255, 0)";
            } else {
              debugCtx.fillStyle = "rgb(255, 0, 255)";
            }
            debugCtx.fillRect(i.pos, 0, 1, height);
          }
          break;
        } case 3: {
          debugCtx.fillStyle = "rgb(0, 255, 0)";
          for (let i of s.starts) {
            debugCtx.fillRect(s.diffs[i.start].pos, 0, 1, height);
          } 
          
          debugCtx.fillStyle = "rgb(255, 0, 255)";
          for (let i of s.ends) {
            debugCtx.fillRect(s.diffs[i.end].pos, 0, 1, height);
          }
          break; 
        }
      }
          
      debugCanvases.appendChild(debugCanvas);
      debugCanvases.appendChild(document.createElement("br"));
    }
    
    const readHorizontalLine = function(array) {
      const toleranceDelta = 1 / 16;
      
      // computes delta of brightness values
      const lineDelta = function() {
        let last = array[0];
        for (let i=0; i<array.length; i++) {
          const a = array[i] - last;
          last = array[i];
          array[i] = a;
        }
        
        addToDebugCanvases(array, {m: 1, toleranceDelta: toleranceDelta});
      }
      
      const brightnessPositions = function() {
        const diffs = [{
          change: null,
          pos: -Infinity
        }];
        let last = null;
        
        for (let i=0; i<array.length; i++) {
          if (Math.abs(array[i]) > toleranceDelta) {
            if (last === null) { // nothing, always push
              const next = {
                change: array[i],
                pos: i
              };
              last = next;
              diffs.push(next);
            } else {
              // if it's opposite changes (required for barcode)
              if (Math.sign(array[i]) !== Math.sign(last.change)) {
                const next = {
                  change: array[i],
                  pos: i
                };
                last = next;
                diffs.push(next);
              }
            }
          }
        }
        
        diffs.push({
          change: null,
          pos: Infinity
        });
        
        return diffs;
      }
      
      // find 10+:2:1:1 ratio
      const find10p211 = function(diffs) {
        const toleration = 0.5;
        
        const quietLength = 8;
        const check = function(i, bar, f) {
          if (Math.abs(Math.abs(diffs[i].pos - diffs[i+1*f].pos) - bar) > toleration * bar) return false;
          if (Math.abs(Math.abs(diffs[i+1*f].pos - diffs[i+2*f].pos) - bar) > toleration * bar) return false;
          if (Math.abs(Math.abs(diffs[i+2*f].pos - diffs[i+3*f].pos) - 2 * bar) > toleration * 2 * bar) return false;
          if (Math.abs(diffs[i+3*f].pos - diffs[i+4*f].pos) < quietLength * bar) return false;
          return true;
        }
        
        const possibleStarts = [];
        
        for (let i=4; i<diffs.length-1; i++) {
          // length of one bar at position
          const bar = (
            diffs[i].pos - diffs[i-3].pos
          ) / 4;
          
          if (check(i, bar, -1)) {
            possibleStarts.push({
              start: i-3,
              bar: bar
            });
          }
        }
        
        const possibleEnds = [];
        
        for (let i=diffs.length-5; i>-1; i--) {
          // length of one bar at position
          const bar = (
            diffs[i+3].pos - diffs[i].pos
          ) / 4;
          
          if (check(i, bar, 1)) {
            possibleEnds.push({
              end: i+3,
              bar: bar
            });
          }
        }
        
        return {
          starts: possibleStarts,
          ends: possibleEnds
        };
      }
      
      const findCandidate = function(diffs, bounds) {
        // im lazy
        
        const minSize = 18; // probably more than 18 changes in the middle
        if (
          bounds.starts.length === 1 &&
          bounds.ends.length === 1 &&
          bounds.starts[0].start + minSize < bounds.ends[0].end
        ) {
          return {
            start: bounds.starts[0],
            end: bounds.ends[0]
          };
        } else {
          return null;
        }
      }
      
      // will handle errors
      const readArea = function(diffs, bound) {
        // consider modifying bar length over each data segment
        const bar = (
          bound.start.bar +
          bound.end.bar
        ) / 2;
        
        const data = [];
        
        for (let i=bound.start.start; i<bound.end.end; i++) {
          const dist = diffs[i+1].pos - diffs[i].pos;
          const len = dist / bar;
          const roundedLen = Math.round(len);
          
          // perhaps alert user of possible errors
          data.push(Math.min(4, Math.max(1, roundedLen)));
        }
        
        return data;
      }
      
      lineDelta(); // array modified in-place
      
      const diffs = brightnessPositions(); // returns new array
      // addToDebugCanvases(array, {m: 2, diffs: diffs});
      
      const bounds = find10p211(diffs);
      addToDebugCanvases(array, {
        m: 3, 
        starts: bounds.starts, 
        ends: bounds.ends, 
        toleranceDelta: toleranceDelta,
        diffs: diffs
      });
      // if (bounds.starts.length > 0) console.log(bounds.starts);
      // if (bounds.ends.length > 0) console.log(bounds.ends);
      
      const candidate = findCandidate(diffs, bounds);
      
      // candidate found
      if (candidate === null) {
        return null;
      } else {
        // console.log(candidate.start, candidate.end);
        const result = readArea(diffs, candidate);
        // console.log(result);
        return result;
      }
    };
    
    const getHorizontalLine = function (row) {
      const array = [];
      // 4 bytes for 1 color, w colors for 1 row
      const rowIndex = 4 * w * row;
      
      for (let i=0; i<w; i++) {
        const brightness = (
          (imgData[rowIndex + 4 * i]) +
          (imgData[rowIndex + 4 * i + 1]) +
          (imgData[rowIndex + 4 * i + 2])
        ) / (3 * 255);
        array.push(brightness);
      }
      
      return array;
    }
    
    // extract brightness information from one row
    const lineData = getHorizontalLine(h >> 1);
    addToDebugCanvases(lineData, {m: 0});
    
    // convert brightness information to bar widths
    const barData = readHorizontalLine(lineData);
    if (barData === null) return null;
    
    const data = interpretCode(barData);
    if (data.data) {
      dataElement.innerText = data.data;
    }
    console.log(data);
    
    return lineData;
  }
  
  runCamera();
  cameraData.addEventListener("canplay", canPlay);
  cameraData.requestVideoFrameCallback(frame);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}