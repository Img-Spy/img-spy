import * as React               from "react";
import { Component }            from "react";
import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { Navigator,
         NavigateModuleState,
         navigateSelectors,
         navigateUtils }        from "../../module";

import { LeftBarButton }        from "./left-button";


interface InputProps {
    icons: {
        [name: string]: string;
    };
    forRouter?: string;
}

interface StateProps {
    path: string;
}

interface DispatchProps {
    actions: {
        navigate: Navigator<undefined>;
    };
}

type LeftBarProps = InputProps & StateProps & DispatchProps;

class LeftBarClass extends Component<LeftBarProps> {
    public static displayName = "LeftBar";

    public render() {
        return (
            <div className="left-bar">{this.renderButtons()}</div>
        );
    }

    private renderButtons() {
        return Object.keys(this.props.icons).map((key) => {
            const isActive = this.props.path === key;
            return (
                <LeftBarButton key={key} icon={this.props.icons[key]} active={isActive}
                               onClick={ () => { this.props.actions.navigate(key); } }/>
            );
        });
    }
}


export const LeftBar =
    connect<StateProps, DispatchProps, InputProps, NavigateModuleState>(
        (state, props) => ({
            path: navigateSelectors.getPath(state, props.forRouter),
        }),
        (dispatch, props) => ({ actions: {
            navigate: bindActionCreators(
                navigateUtils.createNavigator(props.forRouter), dispatch
            )
        }})
)(LeftBarClass) as React.ComponentClass<InputProps>;
