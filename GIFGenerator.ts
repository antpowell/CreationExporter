/// <reference path="JS/LZWEncoder.js">

class GIFGenerator {
    stream: EncodedImage = new EncodedImage();
    byteCount: number = 0;
    width: number;
    height: number;
    encodedImage: EncodedImage = new EncodedImage()
    indexedPixels: number[];
    GCT: string[];

    constructor(width: number, height: number, indexedPixels: number[], GCT: string[]) {
        this.width = width;
        this.height = height;
        this.indexedPixels = indexedPixels;
        this.GCT = GCT;
        console.log(`Generator now running...`);
    };

    generate() {

        this.headerGenerator();
        this.LSDGenerator();
        this.GCTWriter();
        this.GCEGenerator();
        this.imgDescGenerator();
        this.imgDataGenerator();
        this.AppExtGenerator();
        this.TrailerGenerator();

    }

    download(filename: string) {
        console.log('downloading');
        console.log(this.stream);

        const download = document.createElement('a');
        download.download = filename;
        download.href = URL.createObjectURL(
            new Blob([new Uint8Array(this.stream.get())], {
                type: 'image/gif'
            })
        );
        download.click();
    }

    headerGenerator() {
        this.stream.writeUTF("GIF89a");                     /* GIF Header */
    }

    LSDGenerator() {
        this.stream.littleEndian(this.width);               /* Canvas Width */
        this.stream.littleEndian(this.height);              /* Canvas Height */
        this.stream.write(0xf7);                            /* Packed Field */
        this.stream.write(0);                               /* Background Color Index */
        this.stream.write(0);                               /* Pixel Aspect Ration */
    }

    GCEGenerator() {
        this.stream.write(0x21);                            /* Extension Introducer */
        this.stream.write(0xf9);                            /* Graphic Control Label */
        this.stream.write(0x4);                             /* Byte Size */
        this.stream.write(0x0);                             /* Packed Field */
        this.stream.littleEndian(0x0);                      /* Delay Time */
        this.stream.write(0x0);                             /* Transparent Color Index */
        this.stream.write(0x0);                             /* Block Terminator */
    }

    imgDescGenerator() {
        this.stream.write(0x2c);                            /* Image Seperator Always 2C */
        this.stream.littleEndian(0x0);                      /* Image Left */
        this.stream.littleEndian(0x0);                      /* Image Top */
        this.stream.littleEndian(this.width);               /* Image Width */
        this.stream.littleEndian(this.height);              /* Image Height */
        this.stream.write(0x0);                             /* Block Terminator */
    }

    AppExtGenerator() {
        this.stream.write(0x21);                            /* extension introducer */
        this.stream.write(0xff);                            /* app extension label */
        this.stream.write(11);                              /* block size */
        this.stream.writeUTF("NETSCAPE" + "2.0");           /* app id + auth code */
        this.stream.write(3);                               /* sub-block size */
        this.stream.write(1);                               /* loop sub-block id */
        this.stream.littleEndian(0);                        /* loop count (extra iterations, 0=repeat forever) */
        this.stream.write(0);                               /* Block Terminator */
    }

    TrailerGenerator() {
        this.stream.write(0x3b);                            /* Trailer Marker */
        console.log(`Generator now finished.`);
    }

    GCTWriter() {
        let count = 0;
        
        this.GCT.forEach(color => {
            count += 3;
            this.stream.writeColor(color);
        });

        for (let i = count; i < 3 * 256; i++) {
            this.stream.write(0);
        }
    }

    imgDataGenerator() {
        const encoder = new LZWEncoder(this.width, this.height, this.indexedPixels, 8);
        encoder.encode(this.stream);
        
    }

    LCTGenerator() {}
    
    PlainTextExtGenerator() {}

    CommentExtGenerator() {}

    

    littleEndian(num: number) {
        this.stream.write(num & 0xff);
        this.stream.write((num >> 8) & 0xff);
    }

}