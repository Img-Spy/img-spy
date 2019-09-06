import { DataSource } from "img-spy-core";
import { FstItem, FstDirectory } from "./fst-watcher.models";
declare type UpdatePathCallback = (name: string, prev: FstItem) => FstItem;
declare function updatePath(rootDir: FstDirectory, path: string, buildCurrItem: UpdatePathCallback): FstDirectory;
declare function deletePath(rootDir: FstDirectory, path: string): FstDirectory;
declare function openPath(rootDir: FstDirectory, path: string, openPath?: boolean): FstDirectory;
declare function insertDataSource(rootDir: FstDirectory, dataSource: DataSource): void;
declare const _default: {
    updatePath: typeof updatePath;
    deletePath: typeof deletePath;
    openPath: typeof openPath;
    insertDataSource: typeof insertDataSource;
};
export default _default;
