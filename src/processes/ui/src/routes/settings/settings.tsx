import * as React               from "react";
import { Component }            from "react";
import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { Route,
         Router,
         LeftBar }              from "img-spy-navigation";
import { settingsActions }      from "img-spy-modules/settings";
import { windowsActions }       from "img-spy-modules/windows";

import { SettingsState }        from "store";

import { CaseSettings }         from "./case-settings";
import { SourcesSettings }      from "./source-settings";


interface InputProps { }

interface StateProps {
    touched: boolean;
}

interface DispatchProps {
    actions: {
        closeModal: () => void;
        acceptSettings: () => void;
        applySettings: () => void;
    }
}

type SettingsProps = InputProps & StateProps & DispatchProps;
class SettingsClass extends Component<SettingsProps> {
    public static displayName = "Settings"
    private static settingsTabs = {
        case: "globe",
        sources: "file"
    };

    public render() {
        return (
            <div className="settings">
                <div className="settings-content">
                    <LeftBar icons={SettingsClass.settingsTabs} forRouter="main.settingsLeftBar"/>
                    <Router name="main.settingsLeftBar" defaultRoute="sources">
                        <Route path="case"><CaseSettings/></Route>
                        <Route path="sources"><SourcesSettings/></Route>
                    </Router>
                </div>
                <div className="settings-keypad">
                    <button className="btn primary"
                            onClick={this.props.actions.acceptSettings}>Ok</button>
                    <button className="btn" onClick={this.props.actions.closeModal}>Cancel</button>
                    <button className="btn" disabled={!this.props.touched}
                            onClick={this.props.actions.applySettings}>Apply</button>
                </div>
            </div>
        );
    }
}

/////////

const applySettings = () =>  settingsActions.applySettings({ close : false });
const acceptSettings = () => settingsActions.applySettings({ close : true });

export const Settings =
    connect<StateProps, DispatchProps, InputProps, SettingsState>(
        (state, props) => ({
            touched: state.forms.settings.$form.touched,
        }),
        (dispatch, props) => ({ actions: {
            closeModal:     bindActionCreators(windowsActions.closeModal, 
                dispatch),
            applySettings:  bindActionCreators(applySettings,  dispatch),
            acceptSettings: bindActionCreators(acceptSettings, dispatch)
        }})
)(SettingsClass) as React.ComponentClass<InputProps>;
