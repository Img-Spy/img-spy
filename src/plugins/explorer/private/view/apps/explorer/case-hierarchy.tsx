import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";
import { Observable,
         fromEvent,
         Subscription }         from "rxjs";
import { filter,
         sampleTime }           from "rxjs/operators";

import { fstWatcherSelectors,
         fstWatcherActions,
         FileSelector,
         FstParent,
         FstRoot,
         FstItem,
         FstDirectory }         from "img-spy-modules/fst-watcher";

import { explorerActions }      from "@public/modules/explorer";
import State                    from "@public/state";

import { CaseHierarchyItem }    from "./case-hierarchy-item";


interface InputProps {}

interface StateProps {
    fstRoot: FstRoot;
    selectedItem: FstItem;
}

interface DispatchProps {
    actions: {
        fstToggleOpen: (item: FileSelector) => void;
        selectFile: (item?: FileSelector) => void;
        activateFile: (item?: FileSelector) => void;
        fstList: (dir: FstItem) => void;
    }
}


type CaseHierarchyProps = InputProps & StateProps & DispatchProps;
export class CaseHierarchyClass
        extends React.Component<CaseHierarchyProps, undefined> {
    public static displayName = "CaseHierarchy";
    public keydownSubs: Subscription;

    constructor(props?: CaseHierarchyProps, context?: any) {
        super(props, context);

        // Bind
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    public onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        event.preventDefault();

        const { selectedItem: item, fstRoot } = this.props;
        const { selectFile, activateFile } = this.props.actions;
        const itemChildren = fstWatcherSelectors.getFstChildren(fstRoot, item);
        let parent = fstWatcherSelectors.getFstParent(fstRoot, item);
        let parentChildren: { [k: string]: FstItem };
        if (parent) {
            parentChildren = 
                fstWatcherSelectors.getFstChildren(fstRoot, parent);
        }

        switch (event.keyCode) {
            case 37: // Left
            if ((item.type === "directory" || item.type === "dataSource") && 
                    item.isOpen) {
                this.itemToggleOpen(item);
                return;
            } else if (parent) {
                selectFile(parent);
                return;
            }
            return;

            case 38: // Up
            if (parent) {
                const children =
                    fstWatcherSelectors.getSortedChildren(parentChildren);
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
                    this.itemToggleOpen(item);
                    return;
                } else {
                    const children = fstWatcherSelectors.getSortedChildren(
                        itemChildren);
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
                const children = fstWatcherSelectors.getSortedChildren(
                    itemChildren);
                selectFile(itemChildren[children[0]]);
                return;
            }

            if (parent) {
                let currItem = item;
                while (parent) {
                    const prevChildren = fstWatcherSelectors.getSortedChildren(
                        parentChildren);
                    const index = prevChildren.indexOf(currItem.name);

                    // If it is the last item selected
                    if (index === prevChildren.length - 1) {
                        currItem = parent as any;
                        parent = fstWatcherSelectors.getFstParent(
                            fstRoot, currItem) as FstDirectory;
                        if(!parent) {
                            return;
                        }
                        
                        parentChildren = fstWatcherSelectors.getFstChildren(
                            fstRoot, parent);
                        continue;
                    }

                    const newItem = parentChildren[prevChildren[index + 1]];
                    if(newItem.address === 'virtual') {
                        
                    }
                    selectFile(parentChildren[prevChildren[index + 1]]);
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
            const prevItemChildren = fstWatcherSelectors.getFstChildren(
                fstRoot,
                prevItem as FstItem
            );
            const prevChild = prevItemChildren[children[index]];
            if (prevChild.type === "directory" || prevChild.type === "dataSource") {
                if (!prevChild.isOpen) {
                    return prevChild;
                }

                const childChildren = fstWatcherSelectors.getFstChildren(
                    fstRoot, prevChild);
                const sortedChildren = fstWatcherSelectors.getSortedChildren(
                    childChildren);
                if (sortedChildren.length === 0) {
                    return prevChild;
                }

                return getOpenPath(prevChild, sortedChildren, sortedChildren.length - 1);
            }
            return prevChild;
        }
    }

    private itemToggleOpen(item: FstItem) {
        this.props.actions.fstToggleOpen(item);

        if (((item.address === "virtual" && item.type === "directory") ||
             (item.type === "dataSource" && item.imgType === "partition")) &&
                item.loaded === undefined) {

            this.props.actions.fstList(item);
        }
    }

    public componentDidMount() {
        const click$: Observable<React.KeyboardEvent<HTMLDivElement>> = fromEvent(document, "keydown") as any

        this.keydownSubs = click$
            .pipe(
                filter((ev: React.KeyboardEvent<HTMLDivElement>) =>
                    !!this.props.selectedItem &&
                    ((ev.keyCode >= 37 && ev.keyCode <= 40) || ev.keyCode === 13)
                )
            ).subscribe(this.onKeyDown);
    }

    public componentWillUnmount() {
        this.keydownSubs.unsubscribe();
    }

    public render() {
        return  (
            <div className="bar-box case-hierarchy">
                <div className="header">
                    Case structure
                </div>
                <div className="body margin scroll">
                    <CaseHierarchyItem item={this.props.fstRoot.children.physical} root={true}/>
                </div>
            </div>
        );
    }
}

export const CaseHierarchy =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            fstRoot: state.fstRoot,
            // TODO: Explorer selected file selector
            selectedItem: state.explorer.selectedFile ? 
                fstWatcherSelectors.getFstItem(
                    state.fstRoot, 
                    state.explorer.selectedFile.path,
                    state.explorer.selectedFile.address
                ) : undefined
        }),
        (dispatch, props) => ({ actions: {
            fstToggleOpen:  bindActionCreators(fstWatcherActions.toggleOpen, 
                dispatch),
            selectFile:     bindActionCreators(explorerActions.selectFile,
                dispatch),
            activateFile:   bindActionCreators(explorerActions.activateFile,
                dispatch),
            fstList:   bindActionCreators(fstWatcherActions.list,
                dispatch),
        }})
)(CaseHierarchyClass) as React.ComponentClass<InputProps>;
