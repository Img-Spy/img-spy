import { remote }               from "electron";
import * as React               from "react";
import * as uuidv1              from "uuid/v1";
import { bindActionCreators }   from "redux";
import { connect,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";

import { ImgSpyState,
         FileSelector,
         DockPanelModel,
         getSortedChildren,
         getMountPoint,
         getFstChildren,
         isFstSelected,
         FstItem,
         FstFile,
         FstRoot,
         FstDataSource,
         CrtTimelinePayload,
         FstDirectory }         from "app/models";
import { fstToggleOpen,
         fstList,
         fstExport,
         openDockPanel,
         activateFile,
         createTimeline,
         Navigator,
         createNavigator,
         selectFile }           from "app/actions";


interface InputCaseHierarchyItemProps {
    item: FstItem;
    root?: boolean;
}

interface CaseHierarchyItemActions {
    fstToggleOpen: (selector: FileSelector) => void;
    fstList: (dir: FstDirectory) => void;
    fstExport: (file: FstFile, path: string) => void;

    createTimeline: (data: CrtTimelinePayload) => void;

    selectFile: (item?: FstItem) => void;
    activateFile: (item?: FstItem) => void;
    toolsNavigator: Navigator<void>;
    openDockPanel: (panel: DockPanelModel) => void;
}

interface CaseHierarchyItemProps {
    item?: FstItem;
    selectedFile?: FileSelector;
    activeFile?: FileSelector;
    fstRoot?: FstRoot;
    folder: string;

    actions?: CaseHierarchyItemActions;
}

const mapStateToProps: MapStateToProps<CaseHierarchyItemProps, InputCaseHierarchyItemProps> =
    (state: ImgSpyState, props) => {
        const { selectedFile, activeFile } = state.explorer;
        const { fstRoot, folder } = state;
        const mapProps: CaseHierarchyItemProps = { selectedFile, activeFile, fstRoot, folder };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<CaseHierarchyItemProps, InputCaseHierarchyItemProps> =
    (dispatch, props) => {
        const actions: CaseHierarchyItemActions = {
            fstToggleOpen:  bindActionCreators(fstToggleOpen,   dispatch),
            fstList:        bindActionCreators(fstList,         dispatch),
            fstExport:      bindActionCreators(fstExport,       dispatch),

            createTimeline: bindActionCreators(createTimeline,  dispatch),
            toolsNavigator: bindActionCreators(createNavigator("main.caseApp"),
                                               dispatch),

            selectFile:     bindActionCreators(selectFile,      dispatch),
            activateFile:   bindActionCreators(activateFile,    dispatch),
            openDockPanel:  bindActionCreators(openDockPanel,   dispatch),
        };

        return { actions } as any;
    };

export class CaseHierarchyItemClass extends React.Component<CaseHierarchyItemProps, undefined> {
    public menu: Electron.Menu;
    public menuOpen: boolean;

    constructor(props?: CaseHierarchyItemProps, context?: any) {
        super(props, context);

        this.onContextMenu = this.onContextMenu.bind(this);
        this.unselectFile = this.unselectFile.bind(this);
    }

    // Events
    private onClick(ev: React.MouseEvent<any>, item: FstItem) {
        ev.stopPropagation();

        this.props.actions.selectFile(item);
        this.props.actions.activateFile(item);
    }

    private onDoubleClick(ev: React.MouseEvent<any>, item: FstItem) {
        ev.stopPropagation();

        if (item.type !== "file") {
            return;
        }

        this.props.actions.openDockPanel({
            componentName: "FstItemPanel",
            id: "panel-" + uuidv1(),
            props: {
                path: item.path
            }
        });
    }

    private onToogleState(ev: React.MouseEvent<any>, item: FstItem) {
        this.props.actions.fstToggleOpen(item);

        if (item.address === "virtual" && item.type === "directory" &&
                item.loaded === undefined) {

            this.props.actions.fstList(item);
        }
    }

    private onContextMenu(ev: React.MouseEvent<HTMLDivElement>) {
        const { item, actions } = this.props;
        const { screenX: x, screenY: y } = ev;

        actions.selectFile(item);
        actions.activateFile(item);

        if (this.menu.items.length > 0) {
            const currWindow = remote.getCurrentWindow();
            setTimeout(() => {
                this.menu.popup(currWindow, { x, y, async: true });
            });
        }
    }

    public componentWillMount() {
        const { item, folder, actions } = this.props;
        this.menu = new remote.Menu();
        if (item.type === "file") {
            this.menu.append(new remote.MenuItem({
                label: "Export",
                click: () => {
                    const name = remote.dialog.showSaveDialog({
                        title: "Export file",
                        defaultPath: `${folder}/${item.name}`
                    }, (path) => {
                        console.log("Export", path);
                        if (path) {
                            actions.fstExport(item, path);
                        }
                    });
                }
            }));
        }

        if (item.address === "virtual" && item.type === "directory") {
            this.menu.append(new remote.MenuItem({
                label: "Timeline",
                click: () => {
                    actions.createTimeline({
                        name: item.name,
                        path: item.path,
                        imgPath: item.imgPath,
                        date: new Date(),

                        offset: item.offset,
                        inode: item.inode
                    });

                    actions.toolsNavigator("timeline");
                }
            }));
        }

        window.addEventListener("click", this.unselectFile);
    }

    public componentWillUnmount() {
        window.removeEventListener("click", this.unselectFile);
    }

    //
    private unselectFile() {
        if (this.props.selectedFile !== undefined) {
            this.props.actions.selectFile();
        }
    }

    public get className(): string {
        return "case-hierarchy-item" +
            (isFstSelected(this.props.item, this.props.selectedFile) ? " selected" : "") +
            (isFstSelected(this.props.item, this.props.activeFile)   ? " active"   : "") +
            (this.props.item.deleted === true ?                        " deleted"  : "");
    }

    // Render
    private StateIcon = (props: {item: FstItem}) =>
    (
        props.item.type === "file" || props.item.canOpen === false  ?
            <span className="state-btn"></span> :
        props.item.type === "dataSource" ?
            <span onClick={(ev) => this.onToogleState(ev, props.item)} className={`state-btn fa ${
                props.item.computedHash !== undefined && props.item.computedHash === props.item.hash ?
                    ( props.item.isOpen ?
                        "fa-angle-down" :
                        "fa-angle-right"
                    ) :
                        " hello manuel"
            }`}></span> :
        props.item.type === "directory" &&
            <span onClick={(ev) => this.onToogleState(ev, props.item)} className={`state-btn fa fa-angle-${
                props.item.isOpen ? "down" : "right"
            }`}></span>
    );

    private ItemIcon = (props: {item: FstItem}) =>
    (
        props.item.type === "directory" ?
            <span className={`item-btn fa fa-folder`}></span> :
        props.item.type === "dataSource" ?
            <span className={`item-btn fa fa-hdd-o`}>
                <span className={`item-btn-status fa ${
                    !props.item.computedHash ?
                        "fa-spinner fa-spin" :
                    props.item.hash === props.item.computedHash ?
                        "fa-check" :
                        "fa-times"
                }`}></span>
            </span> :
        props.item.type === "file" &&
            <span className={`item-btn fa fa-file`}></span>
    );

    private ItemChildren = (props: {item: FstItem}) => {
        const { item } = props;
        if (item.type === "file") {
            return null;
        }
        const children = getFstChildren(this.props.fstRoot, item);

        return (
            <div key="children" className={"children" + (item.isOpen ? "" : " closed")}>
                { getSortedChildren(children).map((childName: string) =>
                    <CaseHierarchyItem key={childName}
                                       item={children[childName]}/>
                )}
            </div>
        );
    };

    public render() {
        const { ItemIcon, StateIcon, ItemChildren } = this;
        const item = this.props.item;

        return (
            <div className={this.className}>
                <div className="case-hierarchy-label"
                     onClick={(ev) => this.onClick(ev, item)}
                     onContextMenu={this.onContextMenu}
                     onDoubleClick={(ev) => this.onDoubleClick(ev, item)}>
                    <StateIcon item={item}/>
                    <ItemIcon item={item}/>
                    <span className="filename dots">{item.name}</span>
                </div>
                <ItemChildren item={item} />
            </div>
        );
    }
}

export const CaseHierarchyItem = connect(mapStateToProps, mapDispatchToProps)(CaseHierarchyItemClass) as React.ComponentClass<InputCaseHierarchyItemProps>;
