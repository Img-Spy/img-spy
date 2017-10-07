import { PartitionInfo }        from "tsk-js";

import { dataSourceTypes }      from "app/constants";
import { TimelineInfo }         from "./timeline.model";


export type Theme = "dark" | "light";

export interface SettingsModel {
    global: {
        caseName: string,
        investigator?: string;
        description?: string;
    };

    sources: {
        [id: string]: DataSource;
    };

    timelines: {
        [key: string]: TimelineInfo
    };

    theme: Theme;
}

export type DataSourceType = "disk" | "partition";
type DataSourceFileAction = "move";

export interface DataSource {
    name: string;
    imgType: DataSourceType;
    path: string;

    hash?: string;
    computedHash: string;
    partitions: Array<PartitionInfo>;

    // file: string;
    // fileAction: DataSourceFileAction;
}

export interface DataSourceForm {
    id: string;
    name: string;
    type: DataSourceType;

    file: Array<File>;
    fileAction: DataSourceFileAction;
}
