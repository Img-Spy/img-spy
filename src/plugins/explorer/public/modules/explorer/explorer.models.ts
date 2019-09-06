// import { Widget } from "@phosphor/widgets";
import { FileSelector } from "img-spy-modules/fst-watcher";

export { FileSelector };


export interface ExplorerModel {
    selectedFile: FileSelector;
    activeFile: FileSelector;

    openPanels: {
        [id: string]: DockPanelModel
    };
}

export interface DockPanelModel<T = any> {
    id: string;
    componentName?: string;
    // widget?: Widget;
    props?: T;
}

export interface ExplorerModuleState {
    explorer: ExplorerModel;
}
