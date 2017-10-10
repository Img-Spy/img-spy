import { TimelineItem }     from "tsk-js";

import { TableSettings }    from "./table.model";


export interface TimelinesModel {
    selected: string;
    timelines: {[key: string]: TimelineInfo};
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
