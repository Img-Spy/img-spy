import * as path                from "path";
import * as React               from "react";
import { Component,
         ComponentClass }       from "react";
import { bindActionCreators, 
         Dispatch }             from "redux";
import { connect }              from "react-redux";
import Helmet                   from "react-helmet";

import { PluginApp, 
         PluginView,
         WindowArgs }           from "img-spy-core";
import { Router,
         Route,
         LeftBar,
         navigateSelectors }    from "img-spy-navigation";
import { WindowEvent }          from "img-spy-material";
import { SettingsModel,
         settingsActions }      from "img-spy-modules/settings";

import { CaseState }            from "store";
import { viewPlugins }          from "plugins";

import { FstWatcher }           from "./fst-watcher";


interface CaseInputProps {}

interface CaseStateProps {
    title: string;
    uuid: string;
}

interface CaseDispatchProps {
    actions: {
        updateSettings: (settings: SettingsModel) => void;
        startPlugin: (pluginView: PluginView<CaseState>) => void;
    }
}

type CaseProps = CaseInputProps & CaseStateProps & CaseDispatchProps;

//////////

export class CaseClass extends Component<CaseProps> {

    protected loadApps(): PluginApp[] {
        return viewPlugins.reduce((acc, p) => acc.concat(p.view.apps), [] as PluginApp[]);
    }

    public componentWillMount() {
        const { actions } = this.props;
        viewPlugins.forEach((plugin) => {
            actions.startPlugin(plugin.view);
        })
    }

    public render() {
        const apps = this.loadApps();
        const defaultRoute = apps.length ? apps[0].name : "";
        const caseTab = apps.reduce((tab, app) => ({
            ...tab,
            [app.name]: app.icon
        }), {});
        const routes = apps.map(a => 
            <Route key={a.name} path={a.name}>{ a.view }</Route>
        );

        return (
            <div className="case flex row full-height">
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>ImgSpy Case - {this.props.title}</title>
                </Helmet>
                <FstWatcher/>
                <WindowEvent uuid={this.props.uuid} event="close-settings"
                             action={this.props.actions.updateSettings}/>
                <LeftBar forRouter="main.caseApp" icons={caseTab}/>
                <Router       name="main.caseApp" defaultRoute={defaultRoute}
                        className="flex-auto">
                    {routes}
                </Router>
            </div>
        );
    }
}

//////////

export const Case = 
    connect<CaseStateProps, CaseDispatchProps, CaseInputProps, CaseState>(
        (state, props) => ({
            title: state.settings.global.caseName,
            uuid: navigateSelectors.getArgs<WindowArgs>(state, "main").uuid
        }),
        (dispatch, props) => ({ actions: {
            updateSettings: bindActionCreators(settingsActions.updateSettings,
                dispatch),
            startPlugin(pluginView: PluginView<CaseState>) {
                pluginView.onStart(dispatch)
            }
        }})
)(CaseClass) as ComponentClass<CaseInputProps>;
