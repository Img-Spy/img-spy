import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { terminalActions,
         TerminalModel,
         TerminalLine }         from "img-spy-modules/terminal";
import { WindowEvent }          from "img-spy-material";

import State                    from "@public/state";


interface InputProps {}

interface StateProps {
    uuid: string;
    terminal: TerminalModel;
}

interface DispatchProps {
    actions: {
        pushTerminalLine: (l: TerminalLine) => void;
    }
}

type TerminalProps = InputProps & StateProps & DispatchProps;

//////////

export class TerminalClass extends React.Component<TerminalProps> {
    public static displayName = "Terminal";

    public pushLine(line: TerminalLine) {
        this.props.actions.pushTerminalLine(line);
    }

    public render() {
        return  (
            <div className="terminal flex column">
                <WindowEvent uuid={this.props.uuid} event="log-terminal"
                             action={(sender, line) => this.pushLine(line)}/>
                <div className="header">
                    <i className="fa fa-terminal" aria-hidden="true"></i> Terminal
                </div>
                <div className="body flex-auto selectable">
                    {this.props.terminal.lines.map((line, i) =>
                        <span key={i}>{line.text}</span>
                    )}
                </div>
            </div>
        );
    }
}

//////////

export const Terminal =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            uuid: state.uuid,
            terminal: state.terminal
        }),
        (dispatch, props) => ({ actions: {
            pushTerminalLine: bindActionCreators(terminalActions.pushLine,
                dispatch),
        }})
)(TerminalClass) as React.ComponentClass<InputProps>;
