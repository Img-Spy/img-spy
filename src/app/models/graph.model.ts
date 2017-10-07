


export interface GraphModel {
    [name: string]: GraphInfo;
}

export interface GraphInfo {
    data: any[];
    options: any;
    width: number;
    heigth: number;
}
