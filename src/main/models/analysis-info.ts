import { ImgInfo } from "tsk-js";


export type AnalysisInfo = ImgInfo & {
    path: string;
    hash: string;
};