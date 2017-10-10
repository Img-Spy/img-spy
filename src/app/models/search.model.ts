import { ImgFile }              from "tsk-js";

import { TableSettings }        from "./table.model";


export interface SearchFormModel {
    needle: string;
    imgPath: string;
}

export interface SearchModel {
    selected: string;
    searchResults: {[key: string]: SearchInfo};
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
