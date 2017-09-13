import * as anymatch        from "anymatch";

import { DataSourceType }   from "./settings.model";

export interface FstInfo {
    name: string;
    path: string;
}

export interface FstFile extends FstInfo {
    type: "file";
}

export interface FstParent extends FstInfo {
    isOpen?: boolean;
    children?: {
        [name: string]: FstItem;
    };
}

export interface FstDataSource extends FstParent {
    type: "dataSource";

    imgType: DataSourceType;
    hash?: string;
    computedHash: string;
    computingHash?: boolean;
    mountedIn?: string;
}

export interface FstDirectory extends FstParent  {
    type: "directory";
}

export type FstItem = FstDirectory | FstFile | FstDataSource;
export type FstType = "directory"  | "file"  | "dataSource";

export interface FstUnlinkPayload {
    path: string;
}

export interface FstHashPayload {
    path: string;
    hash: string;
}

export  const hasFstItem = (rootDir: FstDirectory, path: string): boolean => {
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

export const getFstItem = (rootDir: FstDirectory, path: string): FstItem => {
    if (path === "") {
        return rootDir;
    }

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

export const getFstType = (path: string): FstType => {
    if (anymatch("**/*.dd", path)) {
        return "dataSource";
    }

    return "file";
};

export const getSortedChildren =
    (dir: FstParent): Array<string> => {
        if (!dir.children) {
            return [];
        }

        const sortedKeys = Object
            .keys(dir.children)
            .sort((nameA, nameB) => {
                const fstA = dir.children[nameA],
                    fstB = dir.children[nameB];

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