import { ImgInfo,
         TimelineItem }         from "tsk-js";


export type AnalysisInfo = ImgInfo & {
    path: string;
    hash: string;
};

export interface TimelineAnalysis {
    files: Array<TimelineItem>;
    finish: boolean;
}
