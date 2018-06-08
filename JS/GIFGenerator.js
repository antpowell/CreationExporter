/// <reference path="JS/LZWEncoder.js">
class GIFGenerator {
    constructor(width, height, indexedPixels, GCT) {
        this.stream = new EncodedImage();
        this.byteCount = 0;
        this.encodedImage = new EncodedImage();
        this.width = width;
        this.height = height;
        this.indexedPixels = indexedPixels;
        this.GCT = GCT;
        console.log(`Generator now running...`);
    }
    ;
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
    download(filename) {
        console.log('downloading');
        console.log(this.stream);
        const download = document.createElement('a');
        download.download = filename;
        download.href = URL.createObjectURL(new Blob([new Uint8Array(this.stream.get())], { type: 'image/gif' }));
        download.click();
    }
    headerGenerator() {
        this.stream.writeUTF("GIF89a");
        // this.writeUTFBytes("GIF89a");
    }
    LSDGenerator() {
        this.stream.littleEndian(this.width);
        this.stream.littleEndian(this.height);
        this.stream.write(0xf7);
        this.stream.write(0);
        this.stream.write(0);
    }
    GCTWriter() {
        let count = 0;
        this.GCT.forEach(color => {
            // console.log(color);
            count += 3;
            this.stream.writeColor(color);
        });
        for (let i = count; i < 3 * 256; i++) {
            this.stream.write(0);
        }
    }
    GCEGenerator() {
        this.stream.write(0x21);
        this.stream.write(0xf9);
        this.stream.write(0x4);
        this.stream.write(0x0);
        this.stream.littleEndian(0x0);
        this.stream.write(0x0);
        this.stream.write(0x0);
    }
    imgDescGenerator() {
        this.stream.write(0x2c);
        this.stream.littleEndian(0x0);
        this.stream.littleEndian(0x0);
        this.stream.littleEndian(this.width);
        this.stream.littleEndian(this.height);
        this.stream.write(0x0);
    }
    LCTGenerator() { }
    imgDataGenerator() {
        const encoder = new LZWEncoder(this.width, this.height, this.indexedPixels, 8);
        encoder.encode(this.stream);
    }
    PlainTextExtGenerator() { }
    AppExtGenerator() {
        this.stream.write(0x21); // extension introducer
        this.stream.write(0xff); // app extension label
        this.stream.write(11); // block size
        this.stream.writeUTF("NETSCAPE" + "2.0"); // app id + auth code
        this.stream.write(3); // sub-block size
        this.stream.write(1); // loop sub-block id
        this.stream.littleEndian(0); // loop count (extra iterations, 0=repeat forever)
        this.stream.write(0);
    }
    CommentExtGenerator() { }
    TrailerGenerator() {
        this.stream.write(0x3b);
        console.log(`Generator now finished.`);
    }
    littleEndian(num) {
        this.stream.write(num & 0xff);
        this.stream.write((num >> 8) & 0xff);
    }
}
