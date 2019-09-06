import { map } from 'rxjs/operators';
import { ofType, combineEpics } from 'redux-observable';
import { apiQuery } from 'img-spy-api';

var windows_selectors = {};
//# sourceMappingURL=windows.selectors.js.map

const CLOSE_MODAL = "imgspy/windows/CLOSE_MODAL";
var types = {
    CLOSE_MODAL,
};
//# sourceMappingURL=windows.types.js.map

const closeModal = () => ({
    type: types.CLOSE_MODAL,
    payload: undefined
});
var windows_actions = {
    closeModal
};
//# sourceMappingURL=windows.actions.js.map

var windows_utils = {};
//# sourceMappingURL=windows.utils.js.map

//# sourceMappingURL=windows.reducers.js.map

const closeModalEpic = (action$, state$) => action$.pipe(ofType(types.CLOSE_MODAL), apiQuery(api => api.closeWindow("settings")), map(() => undefined));
//# sourceMappingURL=close-modal.js.map

var index = combineEpics(closeModalEpic);
//# sourceMappingURL=index.js.map

const name = "windows";
//# sourceMappingURL=index.js.map

export default undefined;
export { index as epic, name, windows_actions as windowsActions, windows_selectors as windowsSelectors, types as windowsTypes, windows_utils as windowsUtils };
//# sourceMappingURL=index.js.map
