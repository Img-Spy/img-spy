import * as anymatch        from "anymatch";
import * as crypto          from "crypto";
import { PartitionInfo }    from "tsk-js";

import { FileSelector }     from "./case-window.model";
import { DataSourceType }   from "./settings.model";


export interface FstInfo {
    parentPath?: string;

    name: string;
    path: string;
    address: string;
}

export interface FstFile extends FstInfo {
    type: "file";
}

export interface FstParent extends FstInfo {
    isOpen?: boolean;
    canOpen?: boolean;
    children?: {
        [name: string]: FstItem;
    };
}

export interface FstDataSource extends FstParent {
    type: "dataSource";

    imgType?: DataSourceType;
    partitions?: Array<PartitionInfo>;
    hash?: string;
    computedHash: string;
    computingHash?: boolean;
    mountedIn?: string;
}

export interface FstDirectory extends FstParent  {
    type: "directory";

    imgPath?: string;
    offset?: number;
    inode?: number;
}

export interface FstRoot {
    type: "root";
    name: "root";
    children: {
        [address: string]: FstDirectory;
    };
}

export type FstItem = FstDirectory | FstFile | FstDataSource;
export type FstType = "directory"  | "file"  | "dataSource";

export interface FstAddPayload {
    newItem: FstItem;
    address: string;
}

export interface FstUnlinkPayload {
    path: string;
    address: string;
}

export interface FstHashPayload {
    path: string;
    hash: string;
}

export  const hasFstItem = (fstRoot: FstRoot, path: string): boolean => {
    const rootDir = fstRoot.children.fisical;
    if (path === "") {
        return true;
    }

    const spath = path.split("/");
    return _hasFstItem();

    ///

    function _hasFstItem(currDir = rootDir, index = 0): boolean {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            return !!currDir.children[currName];
        }

        const nextDir = currDir.children[currName];
        if (nextDir && nextDir.type === "directory") {
            return _hasFstItem(nextDir, index + 1);
        }

        return false;
    }
};

export const getFstItem =
    (fstRoot: FstRoot, path: string, address?: string): FstItem => {
        // Defaults
        if (!address) { address = "fisical"; }

        // Get root directory
        const rootDir = fstRoot.children[address];

        // Return root if no path provided
        if (path === "") { return rootDir; }

        // Call recursive get
        const spath = path.split("/");
        return _getPath();

        ///

        function _getPath(currDir = rootDir, index = 0): FstItem {
            const currName = spath[index];
            if (spath.length - 1 === index) {
                return currDir.children[currName];
            }

            const nextDir = currDir.children[currName] as FstDirectory;
            if (!nextDir || nextDir.type !== "directory") {
                throw Error("Directory not found.");
            }

            return _getPath(nextDir, index + 1);
        }
    };

export const getFstParent =
    (fstRoot: FstRoot, item: FstItem): FstParent & FstItem => {
        return item.parentPath !== undefined ?
            getFstItem(fstRoot, item.parentPath) : undefined;
    };

export const getFstChildren =
    (fstRoot: FstRoot, fstItem: FstItem): { [name: string]: FstItem } => {
        switch (fstItem.type) {
            case "directory": return fstItem.children;
            case "dataSource":
            const mountPoint = getMountPoint(fstItem);
            const mountFolder =
                fstRoot.children.virtual.children[mountPoint] as FstDirectory;
            if (mountFolder) {
                return mountFolder.children;
            } else {
                return null;
            }

            default:
                return null;
        }
    };

export const getMountPoint = (fstDataSource: FstItem): string =>
    crypto.createHash("md5").update(fstDataSource.path).digest("hex");

export const getFstType = (path: string): FstType => {
    if (anymatch("**/*.dd", path)) {
        return "dataSource";
    }

    return "file";
};

export const isFstSelected = (item: FstItem, selector: FileSelector) =>
    selector &&
    item.path === selector.path &&
    item.address === selector.address;

export const getSortedChildren =
    (children: { [name: string]: FstItem }): Array<string> => {
        if (!children) {
            return [];
        }

        const sortedKeys = Object
            .keys(children)
            .sort((nameA, nameB) => {
                const fstA = children[nameA],
                    fstB = children[nameB];

                if (fstB.type === "directory" && fstA.type !==  "directory") {
                    return 1;
                }
                if (fstA.type === "directory" && fstB.type !==  "directory") {
                    return -1;
                }

                return nameA.toLowerCase() > nameB.toLowerCase() ? 1 : -1;
            });

        // if (this.props.root) {
        //     sortedKeys = sortedKeys.filter((key) => key !== ".mount");
        // }

        return sortedKeys;
    };
