import { remote }               from "electron";
import * as React               from "react";
import { bindActionCreators }   from "redux";
import { Observable,
         Subscription }         from "rxjs";
import { connect,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";

import { ImgSpyState,
         FileSelector,
         getFstItem,
         getSortedChildren,
         getFstParent,
         getFstChildren,
         FstParent,
         FstRoot,
         FstItem,
         FstDataSource,
         FstDirectory }         from "app/models";
import { fstToggleOpen,
         activateFile,
         selectFile }           from "app/actions";

import { CaseHierarchyItem }    from "./case-hierarchy-item";


interface InputCaseHierarchyProps {

}

interface CaseHierarchyActions {
    fstToggleOpen: (item: FileSelector) => void;
    selectFile: (item?: FileSelector) => void;
    activateFile: (item?: FileSelector) => void;
}

interface CaseHierarchyProps {
    fstRoot?: FstRoot;
    selectedItem?: FstItem;

    actions?: CaseHierarchyActions;
}

const mapStateToProps: MapStateToProps<CaseHierarchyProps, InputCaseHierarchyProps> =
    (state: ImgSpyState, props) => {
        const { fstRoot } = state;
        const { selectedFile } = state.caseWindow;
        let selectedItem;
        if (selectedFile !== undefined) {
            selectedItem = getFstItem(fstRoot, selectedFile.path, selectedFile.address);
        }

        const mapProps: CaseHierarchyProps = { fstRoot, selectedItem };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<CaseHierarchyProps, InputCaseHierarchyProps> =
    (dispatch, props) => {
        const actions: CaseHierarchyActions = {
            fstToggleOpen:  bindActionCreators(fstToggleOpen,   dispatch),
            selectFile:     bindActionCreators(selectFile,      dispatch),
            activateFile:   bindActionCreators(activateFile,    dispatch),
        };

        return { actions } as any;
    };

export class CaseHierarchyClass extends React.Component<CaseHierarchyProps, undefined> {
    public keydownSubs: Subscription;

    constructor(props?: CaseHierarchyProps, context?: any) {
        super(props, context);

        // Bind
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    public onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        const { selectedItem: item, fstRoot } = this.props;
        const { selectFile, activateFile, fstToggleOpen } = this.props.actions;
        const itemChildren = getFstChildren(fstRoot, item);
        let parent = getFstParent(fstRoot, item);
        let parentChildren;
        if (parent) {
            parentChildren = getFstChildren(fstRoot, parent);
        }

        switch (event.keyCode) {
            case 37: // Left
            if (item.type === "directory" || item.type === "dataSource") {
                if (item.isOpen) {
                    fstToggleOpen(item);
                    return;
                } else if (parent) {
                    selectFile(parent);
                    return;
                }
            }
            return;

            case 38: // Up
            if (parent) {
                const children = getSortedChildren(parentChildren);
                const index = children.indexOf(item.name);
                if (index === 0) {
                    selectFile(parent);
                    return;
                }

                const openItem = getOpenPath(parent, children, index - 1);
                selectFile(openItem);
                return;
            }
            return;

            case 39: // Right
            if (item.type === "directory" || item.type === "dataSource") {
                if (!item.isOpen) {
                    fstToggleOpen(item);
                    return;
                } else {
                    const children = getSortedChildren(itemChildren);
                    if (children.length) {
                        selectFile(itemChildren[children[0]]);
                        return;
                    }
                }
            }

            return;

            case 40: // Down
            if ((item.type === "directory" || item.type === "dataSource") &&
                 item.isOpen && itemChildren && Object.keys(itemChildren).length) {
                const children = getSortedChildren(itemChildren);
                selectFile(itemChildren[children[0]]);
                return;
            }

            if (parent) {
                let currItem = item;
                while (parent) {
                    const prevChildren = getSortedChildren(parentChildren);
                    const index = prevChildren.indexOf(currItem.name);
                    if (index === prevChildren.length - 1) {
                        currItem = parent as any;
                        parent = getFstParent(fstRoot, currItem) as FstDirectory;
                        parentChildren = getFstChildren(fstRoot, parent);
                        continue;
                    }

                    selectFile(parent.children[prevChildren[index + 1]]);
                    return;
                }
                return;
            }
            return;

            case 13: // Enter
            activateFile(item);
            return;

        }

        ///////

        function getOpenPath(prevItem: FstParent,
                                 children: Array<string>,
                                 index: number): FstItem {
            const prevItemChildren = getFstChildren(fstRoot, prevItem as FstItem);
            const prevChild = prevItemChildren[children[index]];
            if (prevChild.type === "directory" || prevChild.type === "dataSource") {
                if (!prevChild.isOpen) {
                    return prevChild;
                }

                const childChildren = getFstChildren(fstRoot, prevChild);
                const sortedChildren = getSortedChildren(childChildren);
                if (sortedChildren.length === 0) {
                    return prevChild;
                }

                return getOpenPath(prevChild, sortedChildren, sortedChildren.length - 1);
            }
            return prevChild;
        }
    }

    public componentWillMount() {
        this.keydownSubs =
            Observable
                .fromEvent(document, "keydown")
                .filter((ev: React.KeyboardEvent<HTMLDivElement>) =>
                    !!this.props.selectedItem &&
                    ((ev.keyCode >= 37 && ev.keyCode <= 40) || ev.keyCode === 13)
                )
                .sampleTime(30)
                .subscribe(this.onKeyDown);
    }

    public componentWillUnmount() {
        this.keydownSubs.unsubscribe();
    }

    public render() {
        return  (
            <div className="explorer-bar-box case-hierarchy flex column">
                <div className="header">
                    Case structure
                </div>
                <div className="body margin x-scroll flex-auto">
                    <CaseHierarchyItem item={this.props.fstRoot.children.fisical} root={true}/>
                </div>
            </div>
        );
    }
}

export const CaseHierarchy = connect(
    mapStateToProps,
    mapDispatchToProps
)(CaseHierarchyClass) as React.ComponentClass<InputCaseHierarchyProps>;
