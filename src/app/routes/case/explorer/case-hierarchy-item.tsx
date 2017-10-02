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
         FstDirectory }         from "app/models";
import { fstToggleOpen,
         fstList,
         openDockPanel,
         activateFile,
         selectFile }           from "app/actions";


interface InputCaseHierarchyItemProps {
    item: FstItem;
    root?: boolean;
}

interface CaseHierarchyItemActions {
    fstToggleOpen: (selector: FileSelector) => void;
    fstList: (dir: FstDirectory) => void;
    selectFile: (item?: FstItem) => void;
    activateFile: (item?: FstItem) => void;
    openDockPanel: (panel: DockPanelModel) => void;
}

interface CaseHierarchyItemProps {
    item?: FstItem;
    selectedFile?: FileSelector;
    activeFile?: FileSelector;
    fstRoot?: FstRoot;

    actions?: CaseHierarchyItemActions;
}

const mapStateToProps: MapStateToProps<CaseHierarchyItemProps, InputCaseHierarchyItemProps> =
    (state: ImgSpyState, props) => {
        const { selectedFile, activeFile } = state.caseWindow;
        const { fstRoot } = state;
        const mapProps: CaseHierarchyItemProps = { selectedFile, activeFile, fstRoot };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<CaseHierarchyItemProps, InputCaseHierarchyItemProps> =
    (dispatch, props) => {
        const actions: CaseHierarchyItemActions = {
            fstToggleOpen:  bindActionCreators(fstToggleOpen,   dispatch),
            fstList:        bindActionCreators(fstList,         dispatch),
            selectFile:     bindActionCreators(selectFile,      dispatch),
            activateFile:   bindActionCreators(activateFile,    dispatch),
            openDockPanel:  bindActionCreators(openDockPanel,   dispatch),
        };

        return { actions } as any;
    };



export class CaseHierarchyItemClass extends React.Component<CaseHierarchyItemProps, undefined> {
    private unselectFile = () => {
        if (this.props.selectedFile !== undefined) {
            this.props.actions.selectFile();
        }
    };

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

        if (item.address === "virtual" && item.type === "directory") {
            const children = getFstChildren(this.props.fstRoot, item);
            this.props.actions.fstList(item);
        }
    }

    public componentWillMount() {
        window.addEventListener("click", this.unselectFile);
    }

    public componentWillUnmount() {
        window.removeEventListener("click", this.unselectFile);
    }

    public get className(): string {
        return "case-hierarchy-item" +
            (isFstSelected(this.props.item, this.props.selectedFile) ? " selected" : "") +
            (isFstSelected(this.props.item, this.props.activeFile)   ? " active"   : "");
    }

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
                { getSortedChildren(children).map((childName: string , i) =>
                    <CaseHierarchyItem key={i} item={children[childName]}/>
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
