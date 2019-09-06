import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { Navigator,
         NavigateModuleState,
         TabModel,
         navigateSelectors,
         navigateUtils }        from "../../module";

import { Tab }                  from "./tab";


interface InputProps {
    tabs: TabModel[];
    forRouter: string;
}

interface StateProps {
    path: string;
}

interface DispatchProps {
    actions: {
        navigate: Navigator<undefined>;
    }
}

type TabsProps = InputProps & StateProps & DispatchProps;

class TabsClass extends React.Component<TabsProps> {
    public static displayName = "Tabs";

    public render() {
        return (
            <div className="tabs flex row">
                { this.props.tabs.map((tab, i) =>
                    <Tab key={i} {...tab} active={this.props.path === tab.path }
                        onClick={ () => { this.props.actions.navigate(tab.path); } }/>
                )}
            </div>
        );
    }
}


export const Tabs = 
    connect<StateProps, DispatchProps, InputProps, NavigateModuleState>(
        (state, props) => ({
            path: navigateSelectors.getPath(state, props.forRouter)
        }),
        (dispatch, props) => ({ actions: {
            navigate: bindActionCreators(
                navigateUtils.createNavigator(props.forRouter), dispatch
            )
        }})
)(TabsClass) as React.ComponentClass<InputProps>;
