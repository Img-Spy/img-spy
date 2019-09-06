import { ImgFile,
         ImgInfo }          from "tsk-js";


interface Analysis extends ImgInfo {
    hash: string;
}

export default interface BackgroundMethods {
    analyze(dataSourcePath: string): Analysis;
    list(dataSourcePath: string, imgaddr: number, inode: number): ImgFile[];
    virtualGet(dataSourcePath: string, imgaddr: number, inode: number): string;
    get(filePath: string): string;    
}
