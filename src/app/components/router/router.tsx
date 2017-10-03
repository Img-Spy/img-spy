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


interface InputRouterProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    defaultRoute?: string;
}

interface RouterActions<T> {
    navigate: Navigator<T>;
}

interface RouterMapProps<T> {
    path: string;

    actions?: RouterActions<T>;
}

type RouterProps<T> = InputRouterProps & RouterMapProps<T>;

const mapStateToProps: MapStateToProps<RouterMapProps<any>, InputRouterProps> =
    (state: ImgSpyState, props: InputRouterProps) => {
        const router = getRouter(state, props.name),
              path = router ? router.path : undefined,
              cState: RouterMapProps<any> = { path };

        return cState as any;

    };

const mapDispachToProps: MapDispatchToProps<RouterMapProps<any>, InputRouterProps> =
    (dispatch, props) => {
        const actions: RouterActions<any> = {
            navigate: bindActionCreators(createNavigator(props.name), dispatch)
        };

        return { actions } as any;
    };

export class RouterClass<T> extends Component<RouterProps<T>, undefined> {

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

export const Router = connect(mapStateToProps, mapDispachToProps)(RouterClass) as React.ComponentClass<InputRouterProps>;
