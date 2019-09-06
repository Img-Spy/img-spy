import { FileSelector, FstRoot, FstParent, FstItemMap, FstItem, AddressTypes } from "./fst-watcher.models";
declare function hasFstItem(fstRoot: FstRoot, path: string): boolean;
declare function getFstItem<T extends FstItem>(fstRoot: FstRoot, path: string, address?: AddressTypes): T;
declare function getFstParent(fstRoot: FstRoot, item: FstItem): FstParent & FstItem;
declare function getFstChildren(fstRoot: FstRoot, fstItem: FstItem): FstItemMap;
declare function getMountPoint(fstDataSource: FstItem): string;
declare function getFullPath<T extends {
    imgPath?: string;
    path: string;
}>(fstItem: T): string;
declare function getFstType(path: string): "file" | "dataSource";
declare function isFstSelected(item: FstItem, selector: FileSelector): boolean;
declare function getSortedChildren(children: FstItemMap): Array<string>;
declare const _default: {
    hasFstItem: typeof hasFstItem;
    getFstItem: typeof getFstItem;
    getMountPoint: typeof getMountPoint;
    getFstParent: typeof getFstParent;
    getFstChildren: typeof getFstChildren;
    getFullPath: typeof getFullPath;
    getFstType: typeof getFstType;
    isFstSelected: typeof isFstSelected;
    getSortedChildren: typeof getSortedChildren;
};
export default _default;
