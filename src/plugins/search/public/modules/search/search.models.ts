import { ImgFile }              from "tsk-js";


export type TableSettings = any;

export interface SearchFormModel {
    needle: string;
    imgPath: string;
}

type SearchResults = {[key: string]: SearchInfo};

export interface SearchModel {
    selected: string;
    searchResults: SearchResults;
    tableSettings: TableSettings;
}

export interface CrtSearchPayload {
    id: string;
    name: string;
    needle: string;
    imgPath: string;
    path: string;
    date: Date;

    offset?: number;
    inode?: number;
}

export interface SearchInfo extends CrtSearchPayload {
    complete: boolean;
    tableSettings: TableSettings;
    rawItems: Array<SearchItem>;
}

export interface SearchItem extends ImgFile {
    context: string;
    index: number;
}

export interface SearchModuleState {
    search: SearchModel;
}

export interface SearchSettings {
    search: SearchResults;
};

export { ImgFile }
