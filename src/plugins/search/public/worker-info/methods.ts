import { ImgFile }          from "tsk-js";


export interface SearchResult {
    file: ImgFile;
    context: Buffer;
    index: number;
}

export default interface BackgroundMethods {
    search(dataSourcePath: string, needle: string, imgaddr: number, 
        inode: number): SearchResult;
    // analyze(dataSourcePath: string): Analysis;
    // list(dataSourcePath: string, imgaddr: number, inode: number): ImgFile[];
}
