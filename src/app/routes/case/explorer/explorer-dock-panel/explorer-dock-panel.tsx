import * as React               from "react";
import * as JQuery              from "jquery";
import * as uuidv1              from "uuid/v1";
import { bindActionCreators }   from "redux";
import { connect,
         connectAdvanced,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";
import { CommandRegistry }      from "@phosphor/commands";
import { Message }              from "@phosphor/messaging";
import { BoxPanel,
         CommandPalette,
         ContextMenu,
         DockPanel,
         Menu,
         MenuBar,
         Widget }               from "@phosphor/widgets";

import { ImgSpyState,
         FileSelector,
         DockPanelModel }       from "app/models";
import { openDockPanel,
         closeDockPanel }       from "app/actions";

import { EditorPanel }          from "./editor-panel";
import { ActivePanel }          from "./active-panel";
import { FstItemPanel }         from "./fst-item-panel";
import { DockWindow }           from "./dock-window";


interface InputExplorerDockPanelProps {

}

interface ExplorerDockPanelActions {
    openDockPanel: (panel: DockPanelModel) => void;
    closeDockPanel: (id: string) => void;
}

interface ExplorerDockPanelProps {
    openPanels?: {
        [id: string]: DockPanelModel
    };
    activeFile?: FileSelector;

    actions?: ExplorerDockPanelActions;
}

interface DockPanelProps {
    Component: React.ComponentClass<any>;
    id: string;
    componentProps: any;
}

const mapStateToProps: MapStateToProps<ExplorerDockPanelProps, InputExplorerDockPanelProps> =
    (state: ImgSpyState, props) => {
        const { openPanels, activeFile } = state.caseWindow;
        const mapProps: ExplorerDockPanelProps = { openPanels, activeFile };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<ExplorerDockPanelProps, InputExplorerDockPanelProps> =
    (dispatch, props) => {
        const actions: ExplorerDockPanelActions = {
            openDockPanel:  bindActionCreators(openDockPanel,  dispatch),
            closeDockPanel: bindActionCreators(closeDockPanel, dispatch),
        };

        return { actions } as any;
    };

export class ExplorerDockPanelClass extends React.Component<ExplorerDockPanelProps, undefined> {
    private dock: DockPanel;
    private widgets: {[id: string]: Widget};
    public static components: { [name: string]: React.ComponentClass<any> } = {
        "ActivePanel": ActivePanel,
        "FstItemPanel": FstItemPanel,
    };

    constructor(props?: ExplorerDockPanelProps, context?: any) {
        super(props, context);

        // Bind functions
        this.renderDock = this.renderDock.bind(this);
        this.DockPanel = this.DockPanel.bind(this);
    }

    public componentWillMount(): void {
        this.dock = new DockPanel();
        window.onresize = () => { this.dock.update(); };

        this.widgets = {};
        const id = "panel-" + uuidv1();

        this.props.actions.openDockPanel({
            componentName: "ActivePanel",
            id
        });

        (window as any).openDockPanel = () => {
            this.props.actions.openDockPanel({
                componentName: "ActivePanel",
                id: "panel-" + uuidv1()
            });
        };

        (window as any).closeDockPanel = () => {
            this.props.actions.closeDockPanel(id);
        };
    }

    public componentWillUnount(): void {
        window.onresize = undefined;
    }

    public DockPanel(props: DockPanelProps): JSX.Element {
        const { componentProps, Component } = props;
        const { dock } = this;
        let widget = this.widgets[props.id];
        if (!widget) {
            const node = document.createElement("div");
            this.widgets[props.id] = widget = new Widget({ node });
            jQuery(node).bind("DOMNodeRemoved", () => {
                /* Call close the dock panel! */
            });
            dock.addWidget(widget);
        }
        componentProps.widget = widget;

        return (
            <div className="dock-widget" ref={attachWidget}>
                <Component {...componentProps}/>
            </div>
        );


        function attachWidget(child?: HTMLDivElement) {
            if (child) {
                widget.node.appendChild(child);
            }
        }
    }

    public renderDock(container: HTMLDivElement) {
        Widget.attach(this.dock, container);
    }

    public mapLayout(cb: (Component: React.ComponentClass<any>,
                          id: string,
                          props: any) => JSX.Element): Array<JSX.Element> {
        return Object.keys(this.props.openPanels).map((elName) => {
            const el = this.props.openPanels[elName];
            const { componentName: name, id, id: key } = el;
            const { [name]: Component } = ExplorerDockPanelClass.components;
            const props = { id, ...el.props };

            return cb(Component, id, props);
        });
    }

    public render() {
        const { DockPanel } = this;

        return (
            <div className="dock-panel flex-heigth-auto full-height" ref={this.renderDock}>
                <div style={ { display: "none" } }>
                    { this.mapLayout((Component, id, props) =>
                        <DockPanel key={id} id={id} Component={Component} componentProps={props}/>
                    )}
                </div>
            </div>
        );
    }
}

export const ExplorerDockPanel = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ExplorerDockPanelClass) as React.ComponentClass<InputExplorerDockPanelProps>;
