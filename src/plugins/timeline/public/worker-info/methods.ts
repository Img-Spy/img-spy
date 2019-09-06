import { TimelineItem }          from "tsk-js";


export default interface BackgroundMethods {
    timeline(dataSourcePath: string, imgaddr: number, inode: number): Array<TimelineItem>;
}
