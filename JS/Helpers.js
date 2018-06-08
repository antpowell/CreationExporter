// export function pad(color:number){
//     if( color < 16){
//         return `0${color.toString(16)}`;
//     }else{
//         return color.toString(16);
//     }
// }
// export class encodedImage {
//     data : number[] = [];
//     // constructor(data: number[]){
//     //     this.data = data;
//     // }
//     constructor(){};
//     write(byte:number){
//         this.data.push(byte);
//     }
//     writeArray(array:number[], arraySize:number){
//         for (let i = 0; i < arraySize; i++){
//             this.write(array[i]);
//         }
//     }
//     writeUTF(UTF:string){
//         for(let i = 0; i < UTF.length; i++){
//             this.write(UTF.charCodeAt(i));
//         }
//     }
//     writeColor(color:string){
//         for (let i = 0; i < color.length; i+=2) {
//             const intValue : number = parseInt(color[i]+color[i+1], 16);
//             this.write(intValue);
//         }
//     }
// }
