import { DataSourceType,
         Partition }   from "img-spy-core";


export const dataSourceTypes = {
    DISK: 1,
    PARTITION: 2
};

export const dataSourceFileActions = {
    MOVE: 1
};

export interface FileSelector {
    path: string;
    address: AddressTypes;
}

export type AddressTypes = "virtual" | "physical";

export interface FstInfo {
    parentPath?: string;
    deleted?: boolean;
    loaded?: boolean;
    name?: string;
    content?: Buffer;
    imgPath?: string;
    offset?: number;
    inode?: number;

    path: string;
    address: AddressTypes;
}

export interface FstFile extends FstInfo {
    type: "file";
}

export interface FstItemMap {
    [name: string]: FstItem
}

export interface FstParent extends FstInfo {
    isOpen?: boolean;
    canOpen?: boolean;
    children?: FstItemMap;
}

export interface FstDataSource extends FstParent {
    type: "dataSource";

    imgType?: DataSourceType;
    partitions?: Array<Partition>;
    hash?: string;
    computedHash: string;
    computingHash?: boolean;
    mountedIn?: string;
}

export interface FstDirectory extends FstParent  {
    type: "directory";
}

export interface FstRoot {
    type: "root";
    name: "root";
    children: {
        physical: FstDirectory;
        virtual: FstDirectory;
    };
}

export type FstItem = FstDirectory | FstFile | FstDataSource;
export type FstType = FstItem["type"];

export interface FstAddPayload {
    newItem: Partial<FstItem>;
    address: AddressTypes;
}

export interface FstUnlinkPayload {
    path: string;
    address: AddressTypes;
}

export interface FstHashPayload {
    path: string;
    hash: string;
}

export interface FstExportPayload {
    file: FileSelector;
    path: string;
}

export interface FstState {
    fstRoot: FstRoot;
}
