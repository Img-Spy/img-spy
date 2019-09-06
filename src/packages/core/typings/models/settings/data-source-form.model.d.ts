import { DataSourceType } from "./data-source-type.model";
import { DataSourceFileAction } from "./data-source-file-action.model";
export interface DataSourceForm {
    id: string;
    name: string;
    type: DataSourceType;
    file: Array<File>;
    fileAction: DataSourceFileAction;
}
