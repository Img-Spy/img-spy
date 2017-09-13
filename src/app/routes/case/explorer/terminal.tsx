import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";

import { ImgSpyState,
         TerminalModel,
         TerminalLine }         from "app/models";
import { WindowEvent }          from "app/components";
import { pushTerminalLine }     from "app/actions";


interface InputTerminalProps { }

interface TerminalActions {
    pushTerminalLine: (l: TerminalLine) => void;
}

interface TerminalProps {
    terminal?: TerminalModel;

    actions?: TerminalActions;
}

const mapStateToProps: MapStateToProps<TerminalProps, InputTerminalProps> =
    (state: ImgSpyState, props) => {
        const { terminal } = state;
        const mapProps: TerminalProps = { terminal };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<TerminalProps, InputTerminalProps> =
    (dispatch, props) => {
        const actions: TerminalActions = {
            pushTerminalLine: bindActionCreators(pushTerminalLine, dispatch),
        };

        return { actions } as any;
    };

export class TerminalClass extends React.Component<TerminalProps, undefined> {

    public pushLine(line: TerminalLine) {
        this.props.actions.pushTerminalLine(line);
    }

    public render() {
        return  (
            <div className="terminal flex column">
                <WindowEvent event="log-terminal"
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

export const Terminal = connect(mapStateToProps, mapDispatchToProps)(TerminalClass) as React.ComponentClass<InputTerminalProps>;
