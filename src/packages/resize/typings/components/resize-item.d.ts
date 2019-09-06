import * as React from "react";
import { ResizeDirection, ResizeItemModel } from "../module";
interface ResizeItemProps extends ResizeItemModel {
    children: React.ReactNode;
    parentRefs: {
        [key: string]: React.ReactInstance;
    };
    direction: ResizeDirection;
}
export declare const ResizeItem: (resizeProps: ResizeItemProps) => JSX.Element;
export {};
