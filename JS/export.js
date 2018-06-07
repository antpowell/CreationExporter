const gifObj = {
    header: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
    LSD: [],
    GCT: [],
    GCE: [],
    ImgDesc: [],
    LCT: [],
    ImgData: [],
    PTE: [],
    AppExten: [0x21, 0xff, 0x0b,],
    CommExten: [],
    Trailer: [0x3b]
};
const canvasDataWOAlpha = [];
const canvasSteam = [];
const pixelArray = [];
const colorMap = [];
const canvas = document.getElementById('testCanvas');
const canvasContext = canvas.getContext('2d');
const dataStream = [];
let canvasData;
// let lzw = new LZWEncoder()
const imgObj = {
    'source': null,
    'curent': 0,
    'total_frames': 16,
    'width': canvas.width,
    'height': canvas.height
};
const baseCP = [
    0x000000, 0x00080, 0x0000ff, 0x008000,
    0x008080, 0x00ff00, 0x800000, 0x800080,
    0x808000, 0x808080, 0xc0c0c0, 0xff0000,
    0xff00ff, 0xffff00, 0x00ffff, 0xffffff
];
let img = new Image();
img.crossOrigin = 'anonymous';
// img.src = 'C:\\Users\\t-anpowe\\Downloads\\img.png'
img.src = 'https://picsum.photos/65/65';
imgObj.source = img;
img.onload = () => {
    DrawFrames(canvasContext, imgObj.width, imgObj.height, imgObj);
    imgObj.source = img;
};
const centerImgX = (canvas.width / 2) - (imgObj.width / 2);
const centerImgY = (canvas.height / 2) - (imgObj.height / 2);
let charMap = [];
const charMapper = function () {
    for (let i = 0; i < 256; i++) {
        charMap[i] = String.fromCharCode(i);
    }
    console.log(charMap);
};
const getCanvasDataBtn = document.getElementById('getImgDataBtn');
getCanvasDataBtn.addEventListener('click', (event) => {
    canvasData = getCanvasData();
    gifObj.LSD.push(canvasData.width & 0xff);
    gifObj.LSD.push(canvasData.width >> 8 & 0xff); /* Width */
    gifObj.LSD.push(canvasData.height & 0xff);
    gifObj.LSD.push(canvasData.height >> 8 & 0xff); /* Height */
    gifObj.LSD.push(0x80); /* Packed Field */
    gifObj.LSD.push(0x0); /* Background Color */
    gifObj.LSD.push(0x0); /* Aspect Ratio */
    for (let i = 0; i < canvasData.data.length; i += 4) {
        canvasDataWOAlpha.push({
            red: canvasData.data[i],
            green: canvasData.data[i + 1],
            blue: canvasData.data[i + 2]
        });
        canvasSteam.push(canvasData.data[i]);
        canvasSteam.push(canvasData.data[i + 1]);
        canvasSteam.push(canvasData.data[i + 2]);
    }
    setColorPalette();
    canvasDataWOAlpha.forEach(color => {
        const BreakException = {};
    });
    setImgDescriptor(canvasData.width, canvasData.height);
    // console.log(colorMap);
    console.log(canvasSteam);
});
const downloadBtn = document.getElementById('downloadGIFBtn');
downloadBtn.addEventListener('click', () => {
    download();
    // setColorPalette();
    // setApplicationExtension();
    // console.log(gifObj);
});
var DrawFrames = function (ctx, x, y, iobj) {
    canvasContext.fillStyle = '#fdf6e3';
    canvasContext.fillRect((32 / 2), (32 / 2), 32, 32);
    // ctx.clearRect(0, 0, x, y);
    // if (iobj.source != null) {
    //     ctx.drawImage(iobj.source, centerImgX, centerImgY, iobj.width, iobj.height);
    //     iobj.current = (iobj.current + 1) % iobj.total_frames;
    //     // incrementing the current frame and assuring animation loop
    //     //  localStorage.setItem()
    //     console.log(iobj);
    // }
};
const getCanvasData = function () {
    return canvasContext.getImageData(0, 0, canvas.width, canvas.height);
};
const setColorPalette = function () {
    const palette = [];
    // for (var j = 0; j < 256; ++j) {
    for (var i = 0; i < 256; ++i)
        palette.push(i << 16 | i << 8 | i);
    // gf.addFrame(0, j, 256, 1, indices, {palette: palette, disposal: 1});
    //   }
    //   console.log(palette);
    //   setGCT(palette);
    setGCT(baseCP);
    // baseCP.forEach(color => {
    //     gifObj.GCT.push(color);
    // })
};
const setGCT = function (palette) {
    let colors = [];
    for (let i = 0; i < palette.length; ++i) {
        gifObj.GCT.push(palette[i] >> 16 & 0xff);
        gifObj.GCT.push(palette[i] >> 8 & 0xff);
        gifObj.GCT.push(palette[i] & 0xff);
        var rgb = palette[i];
        colors.push(rgb >> 16 & 0xff);
        colors.push(rgb >> 8 & 0xff);
        colors.push(rgb & 0xff);
    }
    // console.log(colors);
};
const setApplicationExtension = function () {
    //encode NETSCAPE2.0
    for (var char of "NETSCAPE2.0") {
        gifObj.AppExten.push(char.charCodeAt(0)); //Push onto AppExt
    }
    gifObj.AppExten.push(0x3);
    gifObj.AppExten.push(0x1);
    gifObj.AppExten.push(0x0);
    gifObj.AppExten.push(0x0 >> 8);
    gifObj.AppExten.push(0x0);
};
const setImgDescriptor = function (width, height) {
    gifObj.ImgDesc.push(0x2c); /* Image Seperator */
    gifObj.ImgDesc.push(0x0);
    gifObj.ImgDesc.push(0x0); /* Left */
    gifObj.ImgDesc.push(0x0);
    gifObj.ImgDesc.push(0x0); /* Top */
    gifObj.ImgDesc.push(width & 0xff);
    gifObj.ImgDesc.push(width >> 8 & 0xff); /* Width */
    gifObj.ImgDesc.push(height & 0xff);
    gifObj.ImgDesc.push(height >> 8 & 0xff); /* Height */
    gifObj.ImgDesc.push(0x0); /* Packed Field */
};
const getImgData = function () {
};
const setImgData = function (data) {
    gifObj.ImgData.push();
};
const putItAllTogether = function () {
    // const dataStream:number[] = [];
    let colorCount = 0, minCodeSize = 0;
    gifObj.header.forEach(element => { dataStream.push(element); });
    gifObj.LSD.forEach(element => { dataStream.push(element); });
    gifObj.GCT.forEach(element => {
        colorCount++;
        dataStream.push(element);
    });
    gifObj.ImgDesc.forEach(element => { dataStream.push(element); });
    const compressedData = lzw_encode(canvasData.data.toString());
    console.log();
    Object.entries(compressedData).forEach(element => gifObj.ImgData.push(element[0]) /* console.log(element[0]) */);
    // while(colorCount >>= 1) ++minCodeSize;
    // colorCount = 1 << minCodeSize;
    // const data = GifWriterOutputLZWCodeStream(dataStream, dataStream.length, minCodeSize, canvasSteam);
    // console.log(data);
    gifObj.ImgData.forEach(element => { dataStream.push(element); });
    gifObj.Trailer.forEach(element => { dataStream.push(element); });
    console.log(dataStream);
};
function download() {
    var downloadLink = document.createElement("a");
    downloadLink.download = 'test.gif';
    downloadLink.innerHTML = "Download File";
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(new Blob([new Uint8Array(dataStream)], { type: "image/gif" }));
    // downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    // document.body.appendChild(downloadLink);
    downloadLink.click();
}
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i = 1; i < data.length; i++) {
        currChar = data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase = currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i = 0; i < out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}
// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i = 1; i < data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}
