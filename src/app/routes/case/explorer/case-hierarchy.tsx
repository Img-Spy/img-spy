import * as React               from "react";
import { bindActionCreators }   from "redux";
import { Observable,
         Subscription }         from "rxjs";
import { connect,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";

import { ImgSpyState,
         getFstItem,
         getSortedChildren,
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
    fstToggleOpen: (path: string) => void;
    selectFile: (path: string) => void;
    activateFile: (path: string) => void;
}

interface CaseHierarchyProps {
    fstRoot?: FstDirectory;
    selectedItem?: FstItem;
    prevItem?: FstDirectory | FstDataSource;

    actions?: CaseHierarchyActions;
}

const mapStateToProps: MapStateToProps<CaseHierarchyProps, InputCaseHierarchyProps> =
    (state: ImgSpyState, props) => {
        const { fstRoot } = state;
        const { selectedFile } = state.caseWindow;
        let selectedItem, prevItem;
        if (selectedFile !== undefined) {
            selectedItem = getFstItem(fstRoot, selectedFile);

            const splittedPath = selectedFile.split("/");
            if (!selectedFile) {
                prevItem = undefined;
            } else if (splittedPath.length > 1) {
                const prevPath = splittedPath
                    .slice(0, splittedPath.length - 1)
                    .join("/");
                prevItem = getFstItem(fstRoot, prevPath);
            } else {
                prevItem = fstRoot;
            }
        }

        const mapProps: CaseHierarchyProps = { fstRoot, selectedItem, prevItem };

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
        const { selectedItem: item, prevItem} = this.props;
        const { selectFile, activateFile, fstToggleOpen } = this.props.actions;

        switch (event.keyCode) {
            case 37: // Left
            if (item.type === "directory" || item.type === "dataSource") {
                if (item.isOpen) {
                    fstToggleOpen(item.path);
                    return;
                } else {
                    selectFile(prevItem.path);
                    return;
                }
            }
            return;

            case 38: // Up
            if (prevItem) {
                const children = getSortedChildren(prevItem);
                const index = children.indexOf(item.name);
                if (index === 0) {
                    selectFile(prevItem.path);
                    return;
                }

                const openPath = getOpenPath(prevItem, children, index - 1);
                selectFile(openPath);
                return;
            }
            return;

            case 39: // Right
            if (item.type === "directory" || item.type === "dataSource") {
                if (!item.isOpen) {
                    fstToggleOpen(item.path);
                    return;
                } else {
                    const children = getSortedChildren(item);
                    if (children.length) {
                        const nextPath = item.children[children[0]].path;
                        selectFile(nextPath);
                        return;
                    }
                }
            }

            return;

            case 40: // Down
            if ((item.type === "directory" || item.type === "dataSource") &&
                 item.isOpen && item.children && Object.keys(item.children).length) {
                const children = getSortedChildren(item);
                selectFile(item.children[children[0]].path);
                return;
            }

            if (prevItem) {
                const prevChildren = getSortedChildren(prevItem);
                const index = prevChildren.indexOf(item.name);
                if (index === prevChildren.length - 1) {
                    return;
                }

                selectFile(prevItem.children[prevChildren[index + 1]].path);
                return;
            }
            return;

            case 13: // Enter
            activateFile(item.path);
            return;

        }

        ///////

        function getOpenPath(prevItem: FstDirectory | FstDataSource,
                                 children: Array<string>,
                                 index: number): string {

            const prevChild = prevItem.children[children[index]];
            if (prevChild.type === "directory" || prevChild.type === "dataSource") {
                if (!prevChild.isOpen) {
                    return prevChild.path;
                }

                const childChildren = getSortedChildren(prevChild);
                if (childChildren.length === 0) {
                    return prevChild.path;
                }

                return getOpenPath(prevChild, childChildren, childChildren.length - 1);
            }
            return prevChild.path;
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
                    <CaseHierarchyItem item={this.props.fstRoot} root={true}/>
                </div>
            </div>
        );
    }
}

export const CaseHierarchy = connect(
    mapStateToProps,
    mapDispatchToProps
)(CaseHierarchyClass) as React.ComponentClass<InputCaseHierarchyProps>;
