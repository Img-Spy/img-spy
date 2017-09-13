import * as React           from "react";
import { Component }        from "react";
import { connect,
         MapStateToProps }  from "react-redux";

import { Case,
         Settings,
         SelectCase }       from "app/routes";
import { ImgSpyState }      from "app/models";

import { Router,
         Route }            from "./router";

interface InputAppProps {

}

interface AppProps {
    className?: string;
    theme?: string;
}

const mapStateToProps: MapStateToProps<AppProps, InputAppProps> =
    (state: ImgSpyState, props) => {
        const { theme } = state.settings;
        const mapProps: AppProps = {
            className: state.navigate.main.path,
            theme
        };
        return mapProps as any;
    };

class AppClass extends Component<AppProps, InputAppProps> {
    private lastRoute: string = undefined;

    public componentWillMount() {
        document.body.classList.add(`img-spy-${this.props.className}`);
    }

    public render() {
        return (
            <div style={{ height: "100%" }}>
                <link type="text/css" rel="stylesheet" href={`../style/${this.props.theme}-theme.css`}/>
                <Router name="main">
                    <Route path="case"><Case/></Route>
                    <Route path="case-selector"><SelectCase/></Route>
                    <Route path="settings"><Settings/></Route>
                </Router>
            </div>
        );
    }
}

export const App = connect(
    mapStateToProps
)(AppClass) as React.ComponentClass<InputAppProps>;
