import { handleActions,
         Action }               from "redux-actions";
import * as deepcopy            from "deepcopy";

import { CaseWindowModel,
         DockPanelModel }       from "app/models";
import { actions }              from "app/constants";


export default () => {
    const initialState: CaseWindowModel = {
        selectedFile: undefined,
        activeFile: "",

        openPanels: {}
    };
    return handleActions<CaseWindowModel, string | DockPanelModel>({
            [actions.CASE_SELECT_FILE]:
                (state: CaseWindowModel, action: Action<string>): CaseWindowModel =>
                    ({ ...state, selectedFile: action.payload }),

            [actions.CASE_ACTIVATE_FILE]:
                (state: CaseWindowModel, action: Action<string>): CaseWindowModel =>
                    ({ ...state, activeFile: action.payload }),

            [actions.CASE_OPEN_PANEL]:
                (state: CaseWindowModel, action: Action<DockPanelModel>): CaseWindowModel => {
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
                (state: CaseWindowModel, action: Action<string>): CaseWindowModel => {
                    const { [action.payload]: delPanel, ...panels } = state.openPanels;

                    return {
                        ...state,

                        openPanels: panels
                    };
                },

            [actions.CASE_UPDATE_PANEL]:
                (state: CaseWindowModel, action: Action<DockPanelModel>): CaseWindowModel => {
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
