import { handleActions,
         Action }               from "redux-actions";
import * as deepcopy            from "deepcopy";

import { ExplorerModel,
         FileSelector,
         DockPanelModel }       from "app/models";
import { actions }              from "app/constants";


export default () => {
    const initialState: ExplorerModel = {
        selectedFile: undefined,
        activeFile: { path: "", address: "fisical" },

        openPanels: {}
    };
    return handleActions<ExplorerModel, FileSelector | DockPanelModel | string>({
            [actions.CASE_SELECT_FILE]:
                (state: ExplorerModel, action: Action<FileSelector>): ExplorerModel =>
                    ({ ...state, selectedFile: action.payload }),

            [actions.CASE_ACTIVATE_FILE]:
                (state: ExplorerModel, action: Action<FileSelector>): ExplorerModel =>
                    ({ ...state, activeFile: action.payload }),

            [actions.CASE_OPEN_PANEL]:
                (state: ExplorerModel, action: Action<DockPanelModel>): ExplorerModel => {
                    const panel = action.payload;

                    return {
                        ...state,

                        openPanels: {
                            ...state.openPanels,
                            [panel.id]: {
                                ...panel,
                                props: deepcopy(panel.props)
                            }
                        }
                    };
                },

            [actions.CASE_CLOSE_PANEL]:
                (state: ExplorerModel, action: Action<string>): ExplorerModel => {
                    const { [action.payload]: delPanel, ...panels } = state.openPanels;

                    return {
                        ...state,

                        openPanels: panels
                    };
                },

            [actions.CASE_UPDATE_PANEL]:
                (state: ExplorerModel, action: Action<DockPanelModel>): ExplorerModel => {
                    const { id, props } = action.payload;
                    const panelToUpdate = state.openPanels[id];
                    if (!panelToUpdate) {
                        throw new Error(`Cannot update panel with id '${id}' because it don't exists.`);
                    }

                    return {
                        ...state,

                        openPanels: {
                            ...state.openPanels,
                            [id]: {
                                ...panelToUpdate,
                                props: deepcopy(props)
                            }
                        }
                    };
                },

        }, initialState);
    };
