export interface iGIFObj{
    header      :number[],
    LSD         :number[],
    GCT         :number[],
    GCE         :number[],
    ImgDesc     :number[],
    LCT         :number[],
    ImgData     :string[],
    PTE         :number[],
    AppExten    :number[],
    CommExten   :number[],
    Trailer     :number[]
}

export interface iPixel{
    red     :number,
    green   :number,
    blue    :number,
}