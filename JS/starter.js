const snapshotBtn = document.getElementById('snapshotBtn');
const getImgDataBtn = document.getElementById('getImgDataBtn');
const downloadGIFBtn = document.getElementById('downloadGIFBtn');
const canvas = document.getElementById('testCanvas');
const canvasContext = canvas.getContext('2d');
const imgObj = {
    'source': new Image(),
    'curent': 0,
    'total_frames': 16,
    'width': canvas.width,
    'height': canvas.height
};
const centerImgX = (canvas.width / 2) - (imgObj.width / 2);
const centerImgY = (canvas.height / 2) - (imgObj.height / 2);
const gifFileFormatObj = {
    'Header': {
        'GIF': [0x0047, 0x0049, 0x0046],
        '89a': [0x0038, 0x0039, 0x0061],
    },
    'LSD' /* Logical Screen Description */: {
        'CanvasWidth': new Uint8Array(10),
        'CanvasHeight': new Uint8Array(10),
        'PackedField': 0x000,
        'BackgroundColorIndex': 0x000,
        'PixelAspectRatio': 0x000
    },
    'GCT' /* Global Color Table */: [],
    'GCE' /* Graphic Control Extension */: {
        'ExtensionIntroducer': 0x21,
        'GraphicControlLabel': 0xf9,
        'ByteSize': 0x0,
        'PackedField': 0x0,
        'DelayTime': 0x0,
        'TransparentColorIndex': 0x0,
        'BlockTerminator': 0x0
    },
    'ImgDesc' /* Image Description */: {
        'ImageSeperator': 0x2c,
        'ImageLeft': 0 & 0xffff,
        'ImageTop': 0 & 0xffff,
        'ImageWidth': 0 & 0xffff,
        'ImageHeight': 0 & 0xffff,
        'PackedField': 0x0
    },
    'LCT' /* Local Color Table */: {
        'LZWMinCodeSize': 0x0,
        'DataSubBlocks': 0x0,
        'BlockTerminator': 0x0
    },
    'ImgData' /* Image Data */: {},
    'PTE' /* Plain Text Extension */: {
        'ExtensionIntroducer': 0x21,
        'PlainTextLabel': 0x01,
        'BlockSize': 0x0C,
        'DataSubBlock': 0x0,
        'BlockTerm': 0x0
    },
    'AE' /* Application Extension */: {
        'ExtensionIntroducer': 0x21,
        'ExtensionLabel': 0xff,
        'BlockSize': 0x0B,
        'AppID': 'NETSCAPE',
        'AppAuthCode': '2.0',
        'AppData': 0x0,
        'BlockTerm': 0x0
    },
    'CE' /* Comment Extension */: {
        'ExtensionIntroducer': 0x21,
        'CommentExtensionLabel': 0xFE,
        'DataSubBlock': 0x0,
        'BlockTerm': 0x0
    },
    'Tail': 0x3b
};
const charMap = [];
let utfGIFData;
let img = new Image();
let imgData;
let imgDataWOAlpha = [];
let imgDataURI = [];
let imgBlob;
let imgLength;
let contentType = '';
img.crossOrigin = 'anonymous';
// img.src = 'C:\\Users\\t-anpowe\\Downloads\\img.png'
img.src = 'https://picsum.photos/458/354';
imgObj.source = img;
getImgDataBtn.addEventListener('click', () => {
    charMapper();
    imgData = getCanvasData();
    getRGB(imgData.data);
    imgLength = imgData.width * imgData.height * 4;
    encodeHeader();
    encodeGlobalColorTable();
    encodeImageDescription();
    imgDataWOAlpha.forEach(element => {
        utfGIFData.push(element);
    });
    encodeTrailer();
});
const charMapper = function () {
    for (let i = 0; i < 256; i++) {
        charMap[i] = String.fromCharCode(i);
    }
    console.log(charMap);
};
const getCanvasData = () => {
    return canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    // return canvasContext.getImageData(0,0,10,10);
};
const getRGB = function (data) {
    for (let i = 0; i < data.length; i += 4) {
        imgDataWOAlpha.push(data[i]);
        imgDataWOAlpha.push(data[i + 1]);
        imgDataWOAlpha.push(data[i + 2]);
        console.log(data[i + 3]);
    }
};
const encodeHeader = function () {
    convertData('GIF89a');
    getLogicalScreenDescriptor(imgData);
};
const getLogicalScreenDescriptor = function (data) {
    // console.log(data);
    const globalColorTableSize = 3 * Math.pow(2, 4);
    gifFileFormatObj.LSD
        .CanvasWidth = new Uint8Array(data.width & 0xff);
    gifFileFormatObj.LSD
        .CanvasHeight = new Uint8Array(data.height & 0xff);
    gifFileFormatObj.LSD
        .PackedField = 0xf1;
    gifFileFormatObj.LSD
        .BackgroundColorIndex = 0x00;
    gifFileFormatObj.LSD
        .PixelAspectRatio =
        utfGIFData.push(data.width & 0xFF);
    utfGIFData.push((data.width >> 8) & 0xFF);
    utfGIFData.push(data.height & 0xFF);
    utfGIFData.push((data.height >> 8) & 0xFF);
    utfGIFData.push(0xF1);
    utfGIFData.push(0);
    utfGIFData.push(0);
};
const encodeImageDescription = function () {
    utfGIFData.push(0x2c);
    numberToUTFLilE(0);
    numberToUTFLilE(0);
    numberToUTFLilE(imgData.width);
    numberToUTFLilE(imgData.height);
    utfGIFData.push(0x0);
};
const encodeTrailer = function () {
    utfGIFData.push(0x0);
    utfGIFData.push(0x3B);
};
const encodeGlobalColorTable = function () {
    const r = 0xff0000;
    const g = 0x00ff00;
    const b = 0x0000ff;
    for (let i = 0; i < 4; i++) {
        utfGIFData.push(r);
        utfGIFData.push(g);
        utfGIFData.push(b);
    }
};
const encodeColorTable = function () {
};
const convertData = function (data) {
    for (let i = 0; i < data.length; i++) {
        utfGIFData.push(data.charCodeAt(i));
    }
    console.log(data);
    console.log(utfGIFData);
};
const numberToUTFLilE = function (num) {
    const lower = num & 0xff;
    const upper = (num >> 8) & 0xff;
    // console.log(lower);
    // console.log(upper);
    utfGIFData.push(lower);
    utfGIFData.push(upper);
    return {
        lower,
        upper
    };
};
