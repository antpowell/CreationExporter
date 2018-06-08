class EncodedImage {
    constructor() {
        this.data = [];
    }
    ;
    get() {
        return this.data;
    }
    write(byte) {
        this.data.push(byte);
    }
    writeArray(array, arraySize) {
        for (let i = 0; i < arraySize; i++) {
            this.write(array[i]);
        }
    }
    writeUTF(UTF) {
        for (let i = 0; i < UTF.length; i++) {
            this.write(UTF.charCodeAt(i));
        }
    }
    writeColor(color) {
        for (let i = 0; i < color.length; i += 2) {
            const intValue = parseInt(color[i] + color[i + 1], 16);
            this.write(intValue);
        }
    }
    littleEndian(num) {
        this.write(num & 0xff);
        this.write((num >> 8) & 0xff);
    }
}
