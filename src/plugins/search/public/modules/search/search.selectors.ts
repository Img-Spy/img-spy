import { SearchModuleState } from "./search.models";


function getSelected(state: SearchModuleState) {
    return state.search.searchResults[state.search.selected];
}

export default {
    getSelected
};
