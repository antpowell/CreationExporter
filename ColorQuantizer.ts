module ColorQuantizerModule{
    export interface ColorQuantizer{
        AddColor(color:number):void;
        GetPalette(colorCount: number):number[];
        GetPaletteIndex(color:number):number;
        GetColorCount():number;
        Clear():void;
    }
}