import * as React               from "react";
import * as ReactDOM            from "react-dom";
import { connect,
         Provider,
         MapStateToProps }      from "react-redux";

import { ImgSpyState }          from "app/models";
import { ResizePanel }          from "app/components";
import { appStore }             from "app/store";

import { CaseHierarchy }        from "./case-hierarchy";
import { ExplorerProperties }   from "./editor-properties";
import { Terminal }             from "./terminal";
import { ExplorerDockPanel,
         ActivePanel }          from "./explorer-dock-panel";


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

    public static layout = [{
        type: "layoutGroup",
        orientation: "horizontal",
        items: [{
            type: "layoutGroup",
            width: "20%",
            name: "manuel",
            orientation: "vertical",
            items: [{
                type: "tabbedGroup",
                height: "70%",
                allowPin: false,
                allowUnpin: false,
                allowClose: false,
                items: [{
                    type: "layoutPanel",
                    title: "Case structure",
                    initContent: (container) => {
                        ReactDOM.render(
                            <Provider store={appStore}>
                                <CaseHierarchy/>
                            </Provider>,
                            container[0]
                        );
                    }
                }]
            }, {
                type: "tabbedGroup",
                height: "30%",
                allowPin: false,
                allowUnpin: false,
                allowClose: false,
                pinnedHeight: 0,
                items: [{
                    type: "layoutPanel",
                    title: "Properties",
                    allowPin: false,
                    allowUnpin: false,
                    allowClose: false,
                    initContent: (container) => {
                        ReactDOM.render(
                            <Provider store={appStore}>
                                <ExplorerProperties/>
                            </Provider>,
                            container[0]
                        );
                    }
                }]
            }]
        }, {
            type: "layoutGroup",
            width: "80%",
            orientation: "vertical",
            items: [{
                type: "documentGroup",
                height: "calc(100% - 30px)",
                minHeight: 200,
                allowClose: true,
                items: [{
                    type: "documentPanel",
                    title: "Active Item",
                    allowClose: true,
                    initContent: (container) => {
                        ReactDOM.render(
                            <Provider store={appStore}>
                                <ActivePanel/>
                            </Provider>,
                            container[0]
                        );
                    }
                }]
            }, {
                // type: "tabbedGroup",
                // height: "20%",
                type: "autoHideGroup",
                alignment: "bottom",
                height: 30,
                unpinnedHeight: "20%",
                allowClose: false,
                allowUnpin: false,
                index: 1,
                items: [{
                    type: "layoutPanel",
                    title: "Output",
                    initContent: (container) => {
                        ReactDOM.render(
                            <Provider store={appStore}>
                                <Terminal/>
                            </Provider>,
                            container[0]
                        );
                    }
                }]
            }]
        }]
    }];

    constructor(props?: ExplorerProps, context?: any) {
        super(props, context);

        //
    }

    public render() {
        return (
            <ResizePanel name="explorer" className="explorer flex row flex-width-auto full-height">
                <ResizePanel name="explorerLeftBar"
                             className="explorer-left-bar">
                    <CaseHierarchy/>
                    <ExplorerProperties/>
                </ResizePanel>
                <ResizePanel name="explorerEditor"
                             className="explorer-editor flex column flex-width-auto">
                    {/* <ExplorerDockPanel/> */}
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
