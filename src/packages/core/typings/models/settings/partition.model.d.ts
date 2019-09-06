export interface Partition {
    description: string;
    start: number;
    end: number;
    size: number;
    hasFs: boolean;
}
