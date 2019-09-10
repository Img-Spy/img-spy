import { ImgFile }          from "tsk-js";


export interface SearchResult {
    file: string;
    context: string;
    index: string;
}

export default interface BackgroundMethods {
    search(dataSourcePath: string, needle: string, imgaddr: number, 
        inode: number): SearchResult;
    // analyze(dataSourcePath: string): Analysis;
    // list(dataSourcePath: string, imgaddr: number, inode: number): ImgFile[];
}
