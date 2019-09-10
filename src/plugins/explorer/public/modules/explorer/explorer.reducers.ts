import produce                  from "immer";

import { Reducer }              from "redux-actions";
import { reducerBuilder }       from "img-spy-core";

import { ExplorerModel,
         FileSelector,
         DockPanelModel }       from "./explorer.models";
import types                    from "./explorer.types"


const selectFile: Reducer<ExplorerModel, FileSelector> = (
    state, action    
) => produce(state, draft => {
    draft.selectedFile = action.payload;
});

const activateFile: Reducer<ExplorerModel, FileSelector> = (
    state, action
) => produce(state, draft => {
    draft.activeFile = action.payload;
});

const openPanel: Reducer<ExplorerModel, DockPanelModel> = (
    state, action,
) => produce(state, draft => {
    const panel = action.payload;
    draft.openPanels[panel.id] = panel;
});

const closePanel: Reducer<ExplorerModel, string> = (
    state, action
) => produce(state, draft => {
    delete state.openPanels[action.payload];
});

const updatePanel: Reducer<ExplorerModel, DockPanelModel> = (
    state, action
) => produce(state, draft => {
    const { id, props } = action.payload;
    draft.openPanels[id].props = props;
});


type Payload = FileSelector | string | DockPanelModel;
export default reducerBuilder<ExplorerModel, Payload>({
    [types.SELECT_FILE]: selectFile,
    [types.ACTIVATE_FILE]: activateFile,

    [types.OPEN_PANEL]: openPanel,
    [types.CLOSE_PANEL]: closePanel,
    [types.UPDATE_PANEL]: updatePanel
}, {
    selectedFile: undefined,
    activeFile: { path: "", address: "physical" },
    
    openPanels: {}
});
