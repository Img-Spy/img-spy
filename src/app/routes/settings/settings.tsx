import * as React from "react";
import { Component }            from "react";
import { connect,
         DispatchProp,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";
import { bindActionCreators }   from "redux";

import { Route,
         Router,
         LeftBar }              from "app/components";
import { api }                  from "app/api";
import { closeModal,
         applySettings,
         Navigator }            from "app/actions";
import { ImgSpyState,
         SettingsModel }        from "app/models";

import { CaseSettings }         from "./case-settings";
import { SourcesSettings }      from "./source-settings";


interface InputSettingsProps { }

interface SettingsActions {
    closeModal: () => void;
    acceptSettings: () => void;
    applySettings: () => void;
}

interface SettingsProps extends InputSettingsProps {
    isPinging?: boolean;
    touched?: boolean;

    actions?: SettingsActions;
}

const mapStateToProps: MapStateToProps<SettingsProps, InputSettingsProps> =
    (state: ImgSpyState, props) => {
        const mapProps: SettingsProps = {
            touched: state.forms.settings.$form.touched
        };
        return mapProps as any;
    };

const mapDispachToProps: MapDispatchToProps<SettingsProps, InputSettingsProps> =
    (dispatch, props) => {
        const actions: SettingsActions = {
            closeModal: bindActionCreators(closeModal, dispatch),
            applySettings:  bindActionCreators(() => applySettings({ close: false }), dispatch),
            acceptSettings: bindActionCreators(() => applySettings({ close: true  }), dispatch)
        };

        return { actions } as any;
    };


class SettingsClass extends Component<SettingsProps, undefined> {
    private static settingsTabs = {
        case: "globe",
        sources: "file"
    };

    public render() {
        const { isPinging } = this.props;

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

export const Settings = connect(mapStateToProps, mapDispachToProps)(SettingsClass) as React.ComponentClass<InputSettingsProps>;
