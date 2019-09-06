import { ResizeSize }       from "img-spy-core";

export type ResizeModelMap =  { [name: string]: ResizeModel };

export type ResizeUnit = "percent";
export type ResizeDirection = "horizontal" | "vertical";

export interface ResizeModel {
    size: ResizeSize;
    name: string;
    direction: ResizeDirection;
    rszIndex?: number;
    items: Array<ResizeItemModel>;
}

export { ResizeSize }

export interface ResizeModuleState {
    resize: ResizeModelMap;
}

export interface SizeUnits {
    value: number;
    units: ResizeUnit;
}

export interface ResizeItemModel {
    current: SizeUnits;

    minValue?: SizeUnits;
    maxValue?: SizeUnits;
    defValue?: SizeUnits;
}

export interface UpdateResizePayload {
    name: string;
    size?: ResizeSize;
    items?: Array<ResizeItemModel>;
}

export interface StartResizePayload {
    name: string;
    index: number;
}

export interface ResizePayload {
    name: string;
    mouse: MouseEvent;
}
