import * as React               from "react";
import * as uuidv1              from "uuid/v1";
import { bindActionCreators }   from "redux";
import { connect,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";

import { ImgSpyState,
         DockPanelModel,
         getSortedChildren,
         FstItem,
         FstFile,
         FstDataSource,
         FstDirectory }         from "app/models";
import { fstToggleOpen,
         openDockPanel,
         activateFile,
         selectFile }           from "app/actions";


interface InputCaseHierarchyItemProps {
    item: FstItem;
    root?: boolean;
}

interface CaseHierarchyItemActions {
    fstToggleOpen: (path: string) => void;
    selectFile: (path: string) => void;
    activateFile: (path: string) => void;
    openDockPanel: (panel: DockPanelModel) => void;
}

interface CaseHierarchyItemProps {
    item?: FstItem;
    selectedFile?: string;
    activeFile?: string;
    root?: boolean;
    mount?: FstDirectory;

    actions?: CaseHierarchyItemActions;
}

const mapStateToProps: MapStateToProps<CaseHierarchyItemProps, InputCaseHierarchyItemProps> =
    (state: ImgSpyState, props) => {
        const { selectedFile, activeFile } = state.caseWindow;
        const mount = state.fstRoot.children[".mount"] as FstDirectory;
        const mapProps: CaseHierarchyItemProps = { selectedFile, activeFile, mount };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<CaseHierarchyItemProps, InputCaseHierarchyItemProps> =
    (dispatch, props) => {
        const actions: CaseHierarchyItemActions = {
            fstToggleOpen:  bindActionCreators(fstToggleOpen,   dispatch),
            selectFile:     bindActionCreators(selectFile,      dispatch),
            activateFile:   bindActionCreators(activateFile,    dispatch),
            openDockPanel:  bindActionCreators(openDockPanel,   dispatch),
        };

        return { actions } as any;
    };



export class CaseHierarchyItemClass extends React.Component<CaseHierarchyItemProps, undefined> {
    public static defaultProps = {
        root: false
    };
    private unselectFile = () => {
        if (this.props.selectedFile !== undefined) {
            this.props.actions.selectFile(undefined);
        }
    };

    private onClick(ev: React.MouseEvent<any>, item: FstItem) {
        ev.stopPropagation();

        this.props.actions.selectFile(item.path);
        this.props.actions.activateFile(item.path);
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
        this.props.actions.fstToggleOpen(item.path);
    }

    public componentWillMount() {
        window.addEventListener("click", this.unselectFile);
    }

    public componentWillUnmount() {
        window.removeEventListener("click", this.unselectFile);
    }

    public get className(): string {
        return "case-hierarchy-item" +
            (this.props.item.path === this.props.selectedFile ? " selected" : "") +
            (this.props.item.path === this.props.activeFile   ? " active"   : "");
    }

    private isMounted(fstDataSource: FstDataSource): boolean {
        return !!(
            this.props.mount &&
            fstDataSource.mountedIn &&
            this.props.mount.children[fstDataSource.mountedIn]
        );
    }

    private getMounted(fstDataSource: FstDataSource): FstDirectory {
        return this.props.mount.children[fstDataSource.mountedIn] as FstDirectory;
    }

    private StateIcon = (props: {item: FstItem}) =>
    (
        props.item.type === "file" ?
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

        return (
            item.type === "directory" ?
                <div key="children" className={"children" + (item.isOpen ? "" : " closed")}>
                    { getSortedChildren(item).map((childName: string , i) =>
                        <CaseHierarchyItem key={i} item={item.children[childName]}/>
                    )}
                </div> :
            item.type === "dataSource" && this.isMounted(item) &&
                <div key="children" className={"children" + (item.isOpen ? "" : " closed")}>
                    { getSortedChildren(this.getMounted(item)).map((childName: string , i) =>
                        <CaseHierarchyItem key={i} item={this.getMounted(item).children[childName]}/>
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
