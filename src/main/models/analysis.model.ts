import { ImgInfo,
         ImgFile,
         TimelineItem }         from "tsk-js";


export type AnalysisInfo = ImgInfo & {
    path: string;
    hash: string;
};

export interface TimelineAnalysis {
    files: Array<TimelineItem>;
    finish: boolean;
}

export interface SearchResult {
    file: ImgFile;
    context: Buffer;
    index: number;
}