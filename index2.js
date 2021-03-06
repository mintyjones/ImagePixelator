const sampleArea = document.getElementById('sampleArea');
const colourBox = document.getElementById('colourBox');
const image = document.getElementById('image');
const canvas = document.createElement('canvas');
const canvasNew = document.getElementById('canvasNew');
const context = canvas.getContext('2d');
const contextNew = canvasNew.getContext('2d');
const width = image.width;
const height = image.height;
let collectedColsRow = []
let collectedColsFullImage = []

canvas.width = width;
canvas.height = height;


// measurement in pixels of the element's CSS width, including any borders, padding, and vertical scrollbars (if rendered)
const SAMPLE_SIZE = 10;
console.log("SAMPLE_SIZE: "+SAMPLE_SIZE)
const SAMPLE_CENTER = SAMPLE_SIZE / 2;
console.log("SAMPLE_CENTER: "+SAMPLE_CENTER)
const MIN_X = image.offsetLeft + 10;
console.log("MIN_X: "+MIN_X)
const MAX_X = MIN_X + width - SAMPLE_SIZE;
console.log("MAX_X: "+MAX_X)
const MIN_Y = image.offsetTop + 10;
console.log("MIN_Y: "+MIN_Y)
const MAX_Y = MIN_Y + height - SAMPLE_SIZE;
console.log("MAX_Y: "+MAX_Y)




context.drawImage(image, 0, 0, width, height);

function sampleColor(clientX, clientY) {
  // (top left x coord-)
  const sampleX = Math.max(Math.min(clientX - SAMPLE_CENTER, MAX_X), MIN_X);
  const sampleY = Math.max(Math.min(clientY - SAMPLE_CENTER, MAX_Y), MIN_Y);

  const imageX = sampleX - MIN_X;
  const imageY = sampleY - MIN_Y;
 
  let R = 0;
  let G = 0;
  let B = 0;
  let A = 0;
  let wR = 0;
  let wG = 0;
  let wB = 0;
  let wTotal = 0;
  let sampleCols = []

  const data = context.getImageData(imageX, imageY, SAMPLE_SIZE, SAMPLE_SIZE).data;
  
  // console.log(data)

  const components = data.length;
  // console.log(components)
  
  for (let i = 0; i < components; i += 4) {
    // A single pixel (R, G, B, A) will take 4 positions in the array:
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Update components for solid color and alpha averages:
    R += r;
    G += g;
    B += b;
    A += a;
    
    // Update components for alpha-weighted average:
    const w = a / 255;
    wR += r * w;
    wG += g * w;
    wB += b * w;
    wTotal += w;
  }
  const pixelsPerChannel = components / 4;
  
 // The | operator is used here to perform an integer division:

  R = R / pixelsPerChannel | 0;
  G = G / pixelsPerChannel | 0;
  B = B / pixelsPerChannel | 0;
  wR = wR / wTotal | 0;
  wG = wG / wTotal | 0;
  wB = wB / wTotal | 0;

  // The alpha channel need to be in the [0, 1] range:

  A = A / pixelsPerChannel / 255;
  console.log(`rgb(${ R }, ${ G }, ${ B })`)
  sampleCols.push(R,G,B)
  collectedColsRow.push(sampleCols)
  console.log(collectedColsRow)

}


document.onclick = (e) => console.log(e.clientX, e.clientY, e.target, e.target.id)


function collectColours() {
  for (let i=0; i < height/SAMPLE_SIZE; i++){
    for (let j = 0; j < width/SAMPLE_SIZE; j++) {
      sampleColor(MIN_X+(j*SAMPLE_SIZE), MIN_Y+(i*SAMPLE_SIZE))
    }
    collectedColsFullImage.push(collectedColsRow)
    collectedColsRow = []
  }
  // samples the colours from the first row of the image
  
}

function placeColours(colArray) {
  // for each row in the array
  for(let i=0;i<colArray.length;i++) {
    for(let j=0;j<colArray[i].length;j++) {
      contextNew.fillStyle = `rgb(${colArray[i][j][0]},${colArray[i][j][1]},${colArray[i][j][2]})`
      contextNew.fillRect(j*SAMPLE_SIZE, i*SAMPLE_SIZE, SAMPLE_SIZE, SAMPLE_SIZE)
    }
  }
}

collectColours()
// console.log(collectedColsFullImage)
placeColours(collectedColsFullImage)