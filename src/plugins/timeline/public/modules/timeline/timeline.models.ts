import { TimelineItem }     from "tsk-js";


export type TableSettings = any;

export interface TimelinesModel {
    selected: string;
    timelines: {[path: string]: TimelineInfo};
    tableSettings: TableSettings;
}

export interface CrtTimelinePayload {
    name: string;
    path: string;
    imgPath: string;
    date: Date;

    offset?: number;
    inode?: number;
}

export interface TimelineInfo extends CrtTimelinePayload {
    complete: boolean;
    tableSettings: TableSettings;
    rawItems: Array<TimelineItem>;
    sortedItems: Array<TimelineItem>;
}

export interface TimelineSettings {
    timelines: {[path: string]: TimelineInfo};
}

export interface TimelineModuleState {
    timeline: TimelinesModel;
}

export { TimelineItem }
