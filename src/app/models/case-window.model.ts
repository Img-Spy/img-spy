import { Widget } from "@phosphor/widgets";


export interface CaseWindowModel {
    selectedFile: string;
    activeFile: string;

    openPanels: {
        [id: string]: DockPanelModel
    };
}

export interface DockPanelModel<T = any> {
    id: string;
    componentName?: string;
    widget?: Widget;
    props?: T;
}
