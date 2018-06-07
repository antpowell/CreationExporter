var ColorQuantizerModule;
(function (ColorQuantizerModule) {
    class PaletteQuantizer {
        constructor() {
            this.palette = [];
            this.cache = {};
            this.colorMap = {};
        }
        AddColor(color) {
            let rgba = color.toRBGA();
            if (this.colorMap.hasOwnProperty(rgba)) {
                colorMap[rgba][0] += 1;
            }
            else {
                colorMap.push(rgba, [1]);
            }
        }
        GetPalette(colorCount) {
            this.palette = [];
            const random = Math.floor((Math.random() * 13) + 1);
            // let colors:number[] = Array.from(colorMap.values()) as number[];
            let colors = Object.values(this.colorMap);
            if (colorMap.length > colorCount) {
                colors = SolveRootLevel(colorCount, colors);
                if (colors.length > colorCount) {
                    while (colors.length > colorCount) {
                        colors.pop();
                    }
                }
                this.cache = {};
                this.palette = colors.concat();
                return this.palette;
            }
        }
        GetPaletteIndex(color) {
            let result;
            if (this.cache.hasOwnProperty(color)) {
                result = this.cache[color];
            }
            else {
                result = GetNearestColor(color, palette);
                this.cache[color] = result;
            }
            return result;
        }
        GetColorCount() {
            return Object.keys(colorMap).length;
        }
        Clear() {
            this.cache = {};
            this.colorMap = {};
        }
        SolveRootLevel() {
            let hueComparer = new ColorHueComparer();
            let saturationComparer = new ColorSaturationComparer();
            let brightnessComparer = new ColorBrightnessComparer();
            let hueColor = colors.Distinct(hueComparer);
            let saturationColor = colors.Distinct(saturationComparer);
            let brightnessColor = colors.Distinct(brightnessComparer);
        }
    }
})(ColorQuantizerModule || (ColorQuantizerModule = {}));
