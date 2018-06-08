const snapshotBtn = document.getElementById('snapshotBtn');
const swapImageBtn = document.getElementById('swapImgBtn');
const downloadGIFBtn = document.getElementById('downloadGIFBtn');
const canvas: HTMLCanvasElement = document.getElementById('testCanvas') as HTMLCanvasElement;
const canvasContext = canvas.getContext('2d');
const centerImgX = (canvas.width / 2) - (canvas.width / 2);
const centerImgY = (canvas.height / 2) - (canvas.height / 2);
const RGBPixelData: string[] = [];
const HEXPixelData: string[] = [];
const colorLookup: {
    [index: string]: number
} = {};
const globalColorTable: string[] = [];
const indexedPixels: number[] = [];
let canvasData: Uint8ClampedArray;
let gifGenerator: GIFGenerator;

function init() {

    setCanvas();
    generateColorTable();

}
init();

function generateGIF() {
    gifGenerator = new GIFGenerator(canvas.width, canvas.height, indexedPixels, globalColorTable);
    gifGenerator.generate();
}

function setCanvas(imgSource ? : string) {

    let img = new Image() as HTMLImageElement;

    img.crossOrigin = 'Anonymous'
    img.src = imgSource || 'https://picsum.photos/458/354';
    img.onload = () => {
        canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

}

function removeAlpha(colorArray: Uint8ClampedArray) {
    RGBPixelData.length = 0;
    for (let i = 0; i < colorArray.length; i += 4) {
        const pixel = (pad(snapColor(colorArray[i])) + pad(snapColor(colorArray[i + 1])) + pad(snapColor(colorArray[i + 2])))

        RGBPixelData.push(pixel);
    }
}

function generateColorTable() {
    const distribution = 51;

    let count = 0;
    for (let red: number = 0; red < 256; red += distribution) {
        for (let green: number = 0; green < 256; green += distribution) {
            for (let blue: number = 0; blue < 256; blue += distribution) {

                const pixel = pad(red) + pad(green) + pad(blue);

                globalColorTable.push(pixel);

                colorLookup[pixel] = count;

                count++;
            }
        }
    }

    return colorLookup;

}

function snapColor(color: number) {
    if (color % 51 > Math.floor(51 / 2)) {
        color += (51 - (color % 51))
    } else {
        color -= (color % 51)
    }
    return color;
}

function pad(color: number) {
    if (color < 16) {
        return `0${color.toString(16)}`;
    } else {
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
    indexedPixels.length = 0;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

}

snapshotBtn.addEventListener('click', () => {
    canvasData = canvasContext.getImageData(0, 0, canvas.width, canvas.height).data;
    removeAlpha(canvasData);
    mapPixelIndex();
    generateGIF();
})

downloadGIFBtn.addEventListener('click', () => {
    gifGenerator.download('CanvasExporter.gif');
})

swapImageBtn.addEventListener('click', () => {
    reset();
    setCanvas('https://picsum.photos/800/800/?random');
})