module ColorQuantizerModule {
    class PaletteQuantizer implements ColorQuantizer {
        private palette: number[];
        private cache: {};
        private colorMap: {};

        constructor() {
            this.palette = [];
            this.cache = {};
            this.colorMap = {};
        }

        AddColor(color:number){
            let rgba = color.toRBGA();

            if(this.colorMap.hasOwnProperty(rgba)){
                colorMap[rgba][0]+=1;
            }else{
                colorMap.push(rgba, [1])
            }
        }

        GetPalette(colorCount:number):number[]{
            this.palette = [];
            const random = Math.floor((Math.random() * 13) + 1);
            // let colors:number[] = Array.from(colorMap.values()) as number[];
            let colors:number[] = Object.values(this.colorMap);

            if(colorMap.length > colorCount){
                colors = SolveRootLevel(colorCount, colors);
                if(colors.length > colorCount){
                    while(colors.length>colorCount){
                        colors.pop();
                    }
                }
                this.cache = {};

                this.palette = colors.concat()

                return this.palette;
            }
        }

        GetPaletteIndex(color:number):number{
            let result:number;

            if(this.cache.hasOwnProperty(color)){
                result = this.cache[color];
            }else{
                result = GetNearestColor(color, palette);
                this.cache[color] = result;
            }
            return result;
        }

        GetColorCount():number{
            return Object.keys(colorMap).length;
        }

        public Clear(){
            this.cache = {};
            this.colorMap = {};
        }

        private SolveRootLevel() {
            let hueComparer = new ColorHueComparer();
            let saturationComparer = new ColorSaturationComparer();
            let brightnessComparer = new ColorBrightnessComparer();

            let hueColor = colors.Distinct(hueComparer);
            let saturationColor = colors.Distinct(saturationComparer);
            let brightnessColor = colors.Distinct(brightnessComparer);

        }
    }
}