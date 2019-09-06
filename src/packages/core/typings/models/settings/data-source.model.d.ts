import { DataSourceType } from "./data-source-type.model";
import { Partition } from "./partition.model";
export interface DataSource {
    name: string;
    imgType: DataSourceType;
    path: string;
    hash?: string;
    computedHash: string;
    partitions: Array<Partition>;
}
