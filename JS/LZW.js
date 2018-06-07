// export class LZW{
//     compress = function(uncompress:string){
//         let dictSize = 256;
//         const dictionary : {[key:string]:number} = {};
//         for(let i = 0; i < dictSize; i++){ dictionary[i.toString()] = i};
//         let w = '';
//         let results:number[];
//         Object.entries(uncompress).forEach(char => {
//             let wc = w+char;
//             if( dictionary.hasOwnProperty(wc) ){
//                 w = wc;
//             }else{
//                 results.push(dictionary[w]);
//                 dictionary[wc] = dictSize++;
//                 w = char.toString();
//             }
//         });
//         if(w !== '') results.push(dictionary[w]);
//         return results
//     }
//     decompress = function(compressed:string[]){
//         let dictSize = 256;
//         const dictionary : {[key:string]:number} = {};
//         for(let i = 0; i < dictSize; i++){ dictionary[i.toString()] = i};
//         // w = 
//     }
// }
export class LZW {
    lzw_encode(s) {
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
}
