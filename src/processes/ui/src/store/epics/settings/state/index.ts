import { CaseState, 
         SettingsState }            from "store/windows";


// TODO: Folder must be in both states???
type State = (CaseState | SettingsState);
// & {
//     folder: string;
// };

export default State;
