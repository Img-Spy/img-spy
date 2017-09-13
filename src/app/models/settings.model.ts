import { dataSourceTypes } from "app/constants";

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

    theme: Theme;
}

export type DataSourceType = 1 | 2;
type DataSourceFileAction = "move";

export interface DataSource {
    name: string;
    imgType: DataSourceType;
    path: string;

    hash?: string;
    computedHash: string;

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
