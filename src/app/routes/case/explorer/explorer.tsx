import * as React               from "react";
import { connect,
         MapStateToProps }      from "react-redux";

import { ImgSpyState }          from "app/models";
import { ResizePanel }          from "app/components";

import { CaseHierarchy }        from "./case-hierarchy";
import { ExplorerProperties }   from "./editor-properties";
import { Terminal }             from "./terminal";
import { ActivePanel }          from "./explorer-dock-panel";


interface InputExplorerProps {
}

interface ExplorerProps {
    theme: string;
}

const mapStateToProps: MapStateToProps<ExplorerProps, InputExplorerProps> =
    (state: ImgSpyState, props) => {
        const { theme } = state.settings;
        const mapProps: ExplorerProps = { theme };

        return mapProps as any;
    };

export class ExplorerClass extends React.Component<ExplorerProps, undefined> {
    public displayName = "Explorer";

    constructor(props?: ExplorerProps, context?: any) {
        super(props, context);

        //
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

export const Explorer = connect(
    mapStateToProps
)(ExplorerClass) as React.ComponentClass<InputExplorerProps>;
