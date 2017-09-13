import * as React               from "react";
import { Component }            from "react";
import { bindActionCreators }   from "redux";
import { DispatchProp,
         MapStateToProps,
         MapDispatchToProps,
         connect }              from "react-redux";

import { createNavigator,
         Navigator }            from "app/actions";
import { ImgSpyState,
         getRouter }          from "app/models";

import { LeftBarButton }        from "./left-button";


interface InputLeftBarProps {
    icons: Icons;
    forRouter?: string;

}

interface LeftBarProps extends DispatchProp<any>, InputLeftBarProps {
    path: string;

    actions: {
        navigate: Navigator<undefined>;
    };
}

interface Icons {
    [k: string]: string;
}

const mapStateToProps: MapStateToProps<LeftBarProps, InputLeftBarProps> =
    (state: ImgSpyState, props) => {
        const router = getRouter(state, props.forRouter),
              path = router ? router.path : undefined;

        return { path } as any;
    };

const mapDispachToProps: MapDispatchToProps<LeftBarProps, InputLeftBarProps> =
    (dispatch, props) => {
        const actions = {
            navigate: bindActionCreators(createNavigator(props.forRouter), dispatch)
        };

        return { actions } as any;
    };

class LeftBarClass extends Component<LeftBarProps, undefined> {
    public render() {
        return (
            <div className="left-bar">{this.renderButtons()}</div>
        );
    }

    private renderButtons() {
        const buttons: Array<JSX.Element> = [];

        return Object.keys(this.props.icons).map((key) => {
            const isActive = this.props.path === key;
            return (
                <LeftBarButton key={key} icon={this.props.icons[key]} active={isActive}
                               onClick={ () => { this.props.actions.navigate(key); } }/>
            );
        });
    }
}

export const LeftBar = connect(mapStateToProps, mapDispachToProps)(LeftBarClass) as React.ComponentClass<InputLeftBarProps>;
