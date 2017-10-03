import * as React               from "react";
import { bindActionCreators }   from "redux";
import { DispatchProp,
         MapStateToProps,
         MapDispatchToProps,
         connect }              from "react-redux";

import { createNavigator,
         Navigator }            from "app/actions";
import { ImgSpyState,
         TabModel,
         getRouter }            from "app/models";

import { Tab }                  from "./tab";


interface InputTabsProps {
    tabs: TabModel[];
    forRouter: string;
}

interface TabsMappedProps extends DispatchProp<any>, InputTabsProps {
    path: string;

    actions?: {
        navigate: Navigator<undefined>;
    };
}

type TabsProps = InputTabsProps & TabsMappedProps;

const mapStateToProps: MapStateToProps<TabsMappedProps, InputTabsProps> =
    (state: ImgSpyState, props) => {
        const router = getRouter(state, props.forRouter),
              path = router ? router.path : undefined;

        return { path } as any;
    };

const mapDispachToProps: MapDispatchToProps<TabsMappedProps, InputTabsProps> =
    (dispatch, props) => {
        const actions = {
            navigate: bindActionCreators(createNavigator(props.forRouter), dispatch)
        };

        return { actions } as any;
    };

class TabsClass extends React.Component<TabsProps, undefined> {
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

export const Tabs = connect(mapStateToProps, mapDispachToProps)(TabsClass) as React.ComponentClass<InputTabsProps>;
