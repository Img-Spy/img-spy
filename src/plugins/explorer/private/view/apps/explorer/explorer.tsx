import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { ResizePanel,
         ResizeModel,
         resizeActions }        from "img-spy-resize";

import State                    from "@public/state";

import { CaseHierarchy }        from "./case-hierarchy";
import { ExplorerProperties }   from "./editor-properties";
import { Terminal }             from "./terminal";
import { ActivePanel }          from "./explorer-dock-panel";


interface InputProps {
}

interface StateProps {
}

interface DispatchProps {
    actions: {
        initializeResize: (initial: ResizeModel) => void;
    }
}

type ExplorerProps = InputProps & StateProps & DispatchProps;

export class ExplorerClass extends React.Component<ExplorerProps> {
    public displayName = "Explorer";

    constructor(props?: ExplorerProps, context?: any) {
        super(props, context);

        //
    }

    componentWillMount() {
        this.props.actions.initializeResize({
            size: undefined,
            name: "explorerLeftBar",
            direction: "vertical",
            items: [
                { current: { value: 70, units: "percent" } },
                { current: { value: 30, units: "percent" } },
            ]
        });

        this.props.actions.initializeResize({
            size: undefined,
            name: "explorer",
            direction: "horizontal",
            items: [
                { current: { value: 10, units: "percent" } },
                { current: { value: 90, units: "percent" } },
            ]
        });

        this.props.actions.initializeResize({
            size: undefined,
            name: "explorerEditor",
            direction: "vertical",
            items: [
                { current: { value: 90, units: "percent" } },
                { current: { value: 10, units: "percent" } },
            ]
        });
    }

    public render() {
        return (
            <ResizePanel name="explorer" className="explorer">
                <ResizePanel name="explorerLeftBar" className="bar"
                             style={{minWidth: "220px"}}>
                    <CaseHierarchy/>
                    <ExplorerProperties/>
                </ResizePanel>
                <ResizePanel name="explorerEditor" className="explorer-editor"
                             style={{minWidth: "450px"}}>
                    <ActivePanel/>
                    <Terminal/>
                </ResizePanel>
            </ResizePanel>
        );
    }
}


export const Explorer =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({

        }),
        (dispatch, props) => ({ actions: {
            initializeResize: bindActionCreators(resizeActions.initialize,
                dispatch)
        }})
)(ExplorerClass) as React.ComponentClass<InputProps>;
