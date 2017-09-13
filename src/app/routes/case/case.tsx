import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";

import { Router,
         Route,
         WindowEvent,
         LeftBar }          from "app/components";
import { ImgSpyState,
         SettingsModel }    from "app/models";
import { updateSettings }   from "app/actions";

import { Explorer }         from "./explorer";
import { FstWatcher }       from "./fst-watcher";


interface InputCaseProps {

}

interface CaseActions {
    updateSettings: (settings: SettingsModel) => void;
}

interface CaseProps {
    title?: string;

    actions?: CaseActions;
}

const mapStateToProps: MapStateToProps<CaseProps, InputCaseProps> =
    (state: ImgSpyState, props) => {
        const mapProps: CaseProps = {
            title: state.settings.global.caseName
        };
        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<CaseProps, InputCaseProps> =
    (dispatch, props) => {
        const actions: CaseActions = {
            updateSettings: bindActionCreators(updateSettings, dispatch),
        };

        return { actions } as any;
    };


export class CaseClass extends React.Component<CaseProps, undefined> {
    public static caseTab = { explorer: "archive" };

    public render() {
        document.title = `ImgSpy Case - ${this.props.title}`;
        return (
            <div className="case full-height">
                <FstWatcher/>
                <WindowEvent event="close-settings" action={this.props.actions.updateSettings}/>
                <LeftBar icons={CaseClass.caseTab} forRouter="main.caseApp"/>
                <Router name="main.caseApp" defaultRoute="explorer">
                    <Route path="explorer"><Explorer/></Route>
                </Router>
            </div>
        );
    }
}

export const Case = connect(
    mapStateToProps,
    mapDispatchToProps
)(CaseClass) as React.ComponentClass<InputCaseProps>;
