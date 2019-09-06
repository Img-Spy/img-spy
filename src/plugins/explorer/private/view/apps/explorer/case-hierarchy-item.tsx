import { remote }               from "electron";
import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { fstWatcherSelectors,
         fstWatcherActions,
         FileSelector,
         FstItem,
         FstRoot }              from "img-spy-modules/fst-watcher";

import { explorerActions }      from "@public/modules/explorer";
import { ContextMenuItem,
         contextMenuActions,
         ContextMenu }          from "@public/modules/context-menu";
import State                    from "@public/state";

import { CaseHierarchyMenu }    from "./case-hierarchy-menu";



interface InputProps {
    item: FstItem;
    root?: boolean;
}

interface StateProps {
    selectedFile: FileSelector;
    activeFile: FileSelector;
    contextMenu: ContextMenu;
    fstRoot: FstRoot;
    folder: string;
}

interface DispatchProps {
    actions: {
        fstToggleOpen: (selector: FileSelector) => void;
        fstList: (dir: FstItem) => void;

        selectFile: (item?: FstItem) => void;
        activateFile: (item?: FstItem) => void;

        fstOpenOut: (file: FstItem) => void;
        menuItemClick: (menuItem: ContextMenuItem, item: FstItem) => void;
    }
}

type CaseHierarchyItemProps = InputProps & StateProps & DispatchProps;

//////////

class CaseHierarchyItemClass extends React.Component<CaseHierarchyItemProps> {
    public static displayName = "CaseHierarchyItem";

    public menu: CaseHierarchyMenu;
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

        this.props.actions.fstOpenOut(item);
    }

    private onToggleState(ev: React.MouseEvent<any>, item: FstItem) {
        this.props.actions.fstToggleOpen(item);

        if (((item.address === "virtual" && item.type === "directory") ||
             (item.type === "dataSource" && item.imgType === "partition")) &&
                item.loaded === undefined) {

            this.props.actions.fstList(item);
        }
    }

    private onContextMenu(ev: React.MouseEvent<HTMLDivElement>) {
        const { item, actions } = this.props;
        const { clientX: x, clientY: y } = ev;
        const { electronMenu } = this.menu;

        actions.selectFile(item);
        actions.activateFile(item);

        if (electronMenu.items.length > 0) {
            const currWindow = remote.getCurrentWindow();
            setTimeout(() => {
                electronMenu.popup({
                    window: currWindow,
                    x, y,
                    // async: true
                });
            });
        }
    }

    public componentDidMount() {
        const { item, folder, actions, contextMenu } = this.props;
        this.menu = new CaseHierarchyMenu(folder, item, contextMenu,
            actions.menuItemClick);

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
        const isSelected = fstWatcherSelectors.isFstSelected;
        return "case-hierarchy-item" +
            (isSelected(this.props.item, this.props.selectedFile) ? " selected" : "") +
            (isSelected(this.props.item, this.props.activeFile)   ? " active"   : "") +
            (this.props.item.deleted === true ?                     " deleted"  : "");
    }

    // Render
    private StateIcon = (props: {item: FstItem}) =>
    (
        props.item.type === "file" || props.item.canOpen === false  ?
            <span className="state-btn"></span> :
        props.item.type === "dataSource" ?
            <span onClick={(ev) => this.onToggleState(ev, props.item)} className={`state-btn fa ${
                props.item.computedHash !== undefined && props.item.computedHash === (props.item.hash || "").toLowerCase() ?
                    ( props.item.isOpen ?
                        "fa-angle-down" :
                        "fa-angle-right"
                    ) :
                        " hello manuel"
            }`}></span> :
        props.item.type === "directory" &&
            <span onClick={(ev) => this.onToggleState(ev, props.item)} className={`state-btn fa fa-angle-${
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
                    (props.item.hash || "").toLowerCase() === props.item.computedHash ?
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
        const children = fstWatcherSelectors.getFstChildren(
            this.props.fstRoot, item);
        const sortedChildren = fstWatcherSelectors.getSortedChildren(children);

        return (
            <div key="children" className={"children" + (item.isOpen ? "" : " closed")}>
                { sortedChildren.map((childName: string) =>
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

//////////

export const CaseHierarchyItem =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            selectedFile: state.explorer.selectedFile,
            activeFile: state.explorer.activeFile,
            contextMenu: state.contextMenu,
            fstRoot: state.fstRoot,
            folder: state.folder
        }),
        (dispatch, props) => ({ actions: {
            fstToggleOpen:  bindActionCreators(fstWatcherActions.toggleOpen,
                dispatch),
            fstList:        bindActionCreators(fstWatcherActions.list,
                dispatch),
            fstOpenOut:     bindActionCreators(fstWatcherActions.openOut,
                dispatch),

            selectFile:     bindActionCreators(explorerActions.selectFile,
                dispatch),
            activateFile:   bindActionCreators(explorerActions.activateFile,
                dispatch),

            menuItemClick:  bindActionCreators(contextMenuActions.click,
                dispatch)
        }})
)(CaseHierarchyItemClass) as React.ComponentClass<InputProps>;
