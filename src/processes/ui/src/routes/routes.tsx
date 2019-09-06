import * as React           from "react";
import { Component }        from "react";
import { connect }          from "react-redux";

import { Router,
         Route }            from "img-spy-navigation";

import { ImgSpyState }      from "store";


import { Case }             from "./case";
import { Settings }         from "./settings";
import { SelectCase }       from "./select-case";


interface InputProps {}

interface StateProps {
    className: string;
    theme: string;
}

interface DispatchProps {}

type RoutesProps = InputProps & StateProps & DispatchProps;

/////////

class RoutesClass extends Component<RoutesProps, InputProps> {
    private lastRoute: string = undefined;

    public componentWillMount() {
        document.body.classList.add(`img-spy-${this.props.className}`);
    }

    public render() {
        return (
            <div style={{ height: "100%" }}>
                {/* <link type="text/css" rel="stylesheet" href={`../style/${this.props.theme}-theme.css`}/> */}
                <Router name="main">
                    <Route path="case"><Case/></Route>
                    <Route path="case-selector"><SelectCase/></Route>
                    <Route path="settings"><Settings/></Route>
                </Router>
            </div>
        );
    }
}

/////////

export const Routes =
    connect<StateProps, DispatchProps, InputProps, ImgSpyState>(    
        (state, props) => ({
            theme: state["settings"] ? state["settings"].theme : "dark",
            className: state.navigate.main.path
        }),
        (dispatch, props) => ({ actions: {

        }})
)(RoutesClass) as React.ComponentClass<InputProps>;
