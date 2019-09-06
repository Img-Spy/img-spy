import { FstType, 
         AddressTypes, 
         FstItem }          from "img-spy-modules/fst-watcher";


export interface ContextMenuItem {
    text: string;
    tag: string;
    type?: FstType | "all";
    address?: AddressTypes | "all";
    group?: "navigation" | "clipboard" | string;
}

export interface ContextMenu {
    [group: string]: ContextMenuItem[];
}

export interface ClickEvent {
    menuItem: ContextMenuItem;
    item: FstItem;
}

export interface ContextMenuModuleState {
    contextMenu: ContextMenu;
}
