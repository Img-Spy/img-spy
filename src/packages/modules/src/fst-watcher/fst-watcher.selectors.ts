import anymatch             from "anymatch";

import { FileSelector,
         FstRoot,
         FstDirectory,
         FstParent,
         FstItemMap,
         FstType,
         FstItem, 
         AddressTypes}          from "./fst-watcher.models";


function hasFstItem(fstRoot: FstRoot, path: string): boolean {
    const rootDir = fstRoot.children.physical;
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

function getFstItem<T extends FstItem>(
    fstRoot: FstRoot, path: string, address?: AddressTypes
): T {
    // Defaults
    if (!address) { address = "physical"; }

    // Get root directory
    const rootDir = fstRoot.children[address];

    // Return root if no path provided
    if (path === "") { return rootDir as T; }

    // Call recursive get
    const spath = path.split("/");
    return _getPath();

    ///

    function _getPath(currDir = rootDir, index = 0): T {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            return currDir.children[currName] as T;
        }

        const nextDir = currDir.children[currName] as FstDirectory;
        if (!nextDir || nextDir.type !== "directory") {
            throw Error("Directory not found.");
        }

        return _getPath(nextDir, index + 1);
    }
}

function getFstParent(fstRoot: FstRoot, item: FstItem): FstParent & FstItem {
    if(item.parentPath !== undefined) {
        // If it is virtual and it is the root element, return the physical path
        // to the disk image file
        if(item.address === 'virtual' && item.parentPath.split('/').length === 1) {
            return getFstItem(fstRoot, item.imgPath);
        }
        return getFstItem(fstRoot, item.parentPath, item.address);
    } else if(item.address === 'virtual') {
        return getFstItem(fstRoot, item.imgPath);
    } else {
        return undefined;
    }
}

function getFstChildren(fstRoot: FstRoot, fstItem: FstItem): FstItemMap  {
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

function getMountPoint(fstDataSource: FstItem): string {    
    // Old version using node crypto
    const crypto = require("crypto");
    return crypto.createHash("md5").update(fstDataSource.path).digest("hex");

    // Using webcrypto
    // const encoder = new TextEncoder();
    // const data = encoder.encode(fstDataSource.path);

    // return self.crypto.subtle.digest("SHA-1", data).then((value) => {
    //     return  hexString(value);
    // });

    // function hexString(buffer) {
    //     const byteArray = new Uint8Array(buffer);
      
    //     const hexCodes = [...byteArray].map(value => {
    //       const hexCode = value.toString(16);
    //       const paddedHexCode = hexCode.padStart(2, '0');
    //       return paddedHexCode;
    //     });
      
    //     return hexCodes.join('');
    // }
}

function getFullPath<T extends {imgPath?: string, path: string}>(
    fstItem: T
): string {
    const { imgPath, path } = fstItem;
    if(imgPath) {
        return `${imgPath}/${path.split("/").slice(1).join("/")}`;
    }
    return `${path.split("/").slice(1).join("/")}`;
    
}

function getFstType(path: string) {
    if (anymatch("**/*.dd", path)) {
        return "dataSource";
    }

    return "file";
}

function isFstSelected(item: FstItem, selector: FileSelector) {
    return selector &&
        item.path === selector.path &&
        item.address === selector.address;
}

function getSortedChildren(children: FstItemMap): Array<string> {
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
}


export default {
    hasFstItem,
    getFstItem,
    getMountPoint,
    getFstParent,
    getFstChildren,
    getFullPath,
    getFstType,
    isFstSelected,
    getSortedChildren
}
