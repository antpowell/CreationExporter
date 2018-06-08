const snapshotBtn = document.getElementById('snapshotBtn');
const swapImageBtn = document.getElementById('swapImgBtn');
const downloadGIFBtn = document.getElementById('downloadGIFBtn');
const canvas = document.getElementById('testCanvas');
const canvasContext = canvas.getContext('2d');
const centerImgX = (canvas.width / 2) - (canvas.width / 2);
const centerImgY = (canvas.height / 2) - (canvas.height / 2);
const RGBPixelData = [];
const HEXPixelData = [];
const colorLookup = {};
const globalColorTable = [];
const indexedPixels = [];
let canvasData;
let gifGenerator;
function init() {
    setCanvas();
    generateColorTable();
}
init();
function generateGIF() {
    gifGenerator = new GIFGenerator(canvas.width, canvas.height, indexedPixels, globalColorTable);
    gifGenerator.generate();
}
function setCanvas(imgSource) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgSource || 'https://picsum.photos/458/354';
    img.onload = () => {
        canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}
function removeAlpha(colorArray) {
    RGBPixelData.length = 0;
    for (let i = 0; i < colorArray.length; i += 4) {
        const pixel = (pad(snapColor(colorArray[i])) + pad(snapColor(colorArray[i + 1])) + pad(snapColor(colorArray[i + 2])));
        RGBPixelData.push(pixel);
    }
}
function generateColorTable() {
    const distribution = 51;
    let count = 0;
    for (let red = 0; red < 256; red += distribution) {
        for (let green = 0; green < 256; green += distribution) {
            for (let blue = 0; blue < 256; blue += distribution) {
                const pixel = pad(red) + pad(green) + pad(blue);
                globalColorTable.push(pixel);
                colorLookup[pixel] = count;
                count++;
            }
        }
    }
    return colorLookup;
}
function snapColor(color) {
    if (color % 51 > Math.floor(51 / 2)) {
        color += (51 - (color % 51));
    }
    else {
        color -= (color % 51);
    }
    return color;
}
function pad(color) {
    if (color < 16) {
        return `0${color.toString(16)}`;
    }
    else {
        return color.toString(16);
    }
}
function mapPixelIndex() {
    RGBPixelData.forEach(pixel => {
        indexedPixels.push(colorLookup[pixel]);
    });
}
function littleEndian() {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 2, true);
    return new Int16Array(buffer)[0];
}
function reset() {
    RGBPixelData.length = 0;
}
snapshotBtn.addEventListener('click', () => {
    canvasData = canvasContext.getImageData(0, 0, canvas.width, canvas.height).data;
    removeAlpha(canvasData);
    mapPixelIndex();
    generateGIF();
});
downloadGIFBtn.addEventListener('click', () => {
    gifGenerator.download('CanvasExporter.gif');
});
swapImageBtn.addEventListener('click', () => {
    setCanvas('https://picsum.photos/800/800/?random');
});
