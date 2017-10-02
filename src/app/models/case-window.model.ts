import { Widget } from "@phosphor/widgets";


export interface FileSelector {
    path: string;
    address: string;
}

export interface CaseWindowModel {
    selectedFile: FileSelector;
    activeFile: FileSelector;

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
