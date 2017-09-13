import * as React               from "react";
import { Component,
         ReactChild }           from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapStateToProps,
         MapDispatchToProps,
         DispatchProp }         from "react-redux";


import { ImgSpyState,
         RouterData,
         getRouter,
         RouteData }            from "app/models";
import { createNavigator,
         Navigator }            from "app/actions";

import { RouteProps }           from "./route";


interface InputRouterProps {
    name: string;
    defaultRoute?: string;
}

interface RouterActions<T> {
    navigate: Navigator<T>;
}

interface RouterProps<T> {
    path: string;
    name?: string;
    defaultRoute?: string;

    actions?: RouterActions<T>;
}

const mapStateToProps: MapStateToProps<RouterProps<any>, InputRouterProps> =
    (state: ImgSpyState, props: InputRouterProps) => {
        const router = getRouter(state, props.name),
              path = router ? router.path : undefined,
              cState: RouterProps<any> = { path };

        return cState as any;

    };

const mapDispachToProps: MapDispatchToProps<RouterProps<any>, InputRouterProps> =
    (dispatch, props) => {
        const actions: RouterActions<any> = {
            navigate: bindActionCreators(createNavigator(props.name), dispatch)
        };

        return { actions } as any;
    };

export class RouterClass<T> extends Component<RouterProps<T>, undefined> {

    public componentWillMount() {
        if (this.props.path === undefined && this.props.defaultRoute) {
            this.props.actions.navigate(this.props.defaultRoute);
        }
    }

    public render() {
        const children = [];
        React.Children.forEach(this.props.children, (ch: React.ReactElement<RouteProps>) => {
            if (ch.props.path === this.props.path) {
                children.push(ch);
                return false;
            }
        });
        return <div className={`router router-${this.props.path}`}>{children}</div>;
    }
}

export const Router = connect(mapStateToProps, mapDispachToProps)(RouterClass) as React.ComponentClass<InputRouterProps>;
