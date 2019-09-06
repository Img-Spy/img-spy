import * as React               from "react";
import { Component }            from "react";

import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { Navigator,
         NavigateModuleState,
         navigateUtils, 
         navigateSelectors }    from "../../module";

import { RouteProps }           from "./route";


interface InputProps {
    name: string;
    defaultRoute?: string;
}

interface StateProps {
    path: string
}

interface DispatchProps {
    actions: {
        navigate: Navigator<any>;
    }
}

type RouterProps = InputProps & StateProps & DispatchProps & React.HTMLAttributes<HTMLDivElement>;

class RouterClass extends Component<RouterProps> {

    public componentWillMount() {
        this.checkDefaultRoute();
    }

    public componentDidUpdate() {
        this.checkDefaultRoute();
    }

    private checkDefaultRoute() {
        if (this.props.path === undefined && this.props.defaultRoute) {
            this.props.actions.navigate(this.props.defaultRoute);
        }
    }

    public render() {
        const activeChildren = [];
        const { className, name, path, actions, defaultRoute, children, ...divProps } = this.props;
        React.Children.forEach(this.props.children, (ch: React.ReactElement<RouteProps>) => {
            if (ch.props.path === this.props.path) {
                activeChildren.push(ch);
                return false;
            }
        });

        return (
            <div {...divProps} className={`router router-${this.props.path} ${className ? className : ""}`}>
                {activeChildren}
            </div>
        );
    }
}


export const Router =
    connect<StateProps, DispatchProps, InputProps, NavigateModuleState>(
        (state, props) => ({
            path: navigateSelectors.getPath(state, props.name)
        }),
        (dispatch, props) => ({ actions: {
            navigate: bindActionCreators(
                navigateUtils.createNavigator(props.name), dispatch
            )
        }})
)(RouterClass) as React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>>;
