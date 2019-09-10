import { map } from 'rxjs/operators';
import { ofType, combineEpics } from 'redux-observable';
import { apiQuery } from 'img-spy-api';

var windows_selectors = {};

const CLOSE_MODAL = "imgspy/windows/CLOSE_MODAL";
var types = {
    CLOSE_MODAL,
};

const closeModal = () => ({
    type: types.CLOSE_MODAL,
    payload: undefined
});
var windows_actions = {
    closeModal
};

var windows_utils = {};

const closeModalEpic = (action$, state$) => action$.pipe(ofType(types.CLOSE_MODAL), apiQuery(api => api.closeWindow("settings")), map(() => undefined));

var index = combineEpics(closeModalEpic);

const name = "windows";

export default undefined;
export { index as epic, name, windows_actions as windowsActions, windows_selectors as windowsSelectors, types as windowsTypes, windows_utils as windowsUtils };
//# sourceMappingURL=index.js.map
