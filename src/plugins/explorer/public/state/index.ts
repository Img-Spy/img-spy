import { FstState, 
         FstItem }                  from "img-spy-modules/fst-watcher";
import { TerminalModuleState }      from "img-spy-modules/terminal";

import { ExplorerModuleState }      from "../modules/explorer";
import { ContextMenuModuleState }   from "../modules/context-menu";


type WindowState = {
    folder: string;
    uuid: string;
}

type FormsState = {
    fstItem: FstItem;
}

type ExplorerState =
     ExplorerModuleState &
     ContextMenuModuleState &
     FstState &
     TerminalModuleState &
     WindowState &
     FormsState;

export default ExplorerState;
