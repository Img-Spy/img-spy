import { SettingsModel,
         DataSource,
         DataSourceFileAction,
         DataSourceForm,
         DataSourceType,
         Theme }                from "img-spy-core";


export interface ApplySettingsPayload {
    close: boolean;
}


// export interface SettingsModel {
//     global: {
//         caseName: string,
//         investigator?: string;
//         description?: string;
//     };

//     sources: {
//         [id: string]: DataSource;
//     };

//     timelines: {
//         [key: string]: TimelineInfo
//     };

//     searchResults: {
//         [key: string]: SearchInfo
//     };

//     theme: Theme;
// }

export interface SettingsModuleState {
    settings: SettingsModel;
}

export {
    SettingsModel,
    DataSource,
    DataSourceFileAction,
    DataSourceForm,
    DataSourceType,
    Theme
}