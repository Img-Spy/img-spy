import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";
import { Widget }               from "@phosphor/widgets";

import { FstRoot,
         FstDataSource,
         FstDirectory,
         fstWatcherSelectors,
         fstWatcherActions,
         FstItem, 
         AddressTypes }         from "img-spy-modules/fst-watcher";

import { explorerActions }      from "@public/modules/explorer";
import State                    from "@public/state";

import { DirectoryPanel }       from "./directory-panel";
import { FilePanel }            from "./file-panel";
import { DataSourcePanel }      from "./data-source-panel";


interface InputProps {
    path: string;
    address: AddressTypes;
    widget?: Widget;
}

interface StateProps {
    fstRoot: FstRoot;
    item: FstItem;
}

interface DispatchProps {
    actions: {
        activateFile: (item: FstItem) => void;
        fstList: (dir: FstDirectory) => void;
    }
}


type FstItemPanelProps = InputProps & StateProps & DispatchProps;
export class FstItemPanelClass
        extends React.Component<FstItemPanelProps, undefined> {
    public static displayName = "FstItemPanel";

    constructor(props?: FstItemPanelProps, context?: any) {
        super(props, context);
    }

    public render() {
        const { item, fstRoot, actions } = this.props;
        const key = `${item.address}-${item.path}`;

        if (this.props.widget) {
            this.props.widget.title.label = this.props.item.name;
            this.props.widget.title.closable = true;
        }

        return (
            <div className="fst-item-panel outer-box margin">
                {
                    item.type === "file" ?
                        <FilePanel key={key} item={item} fstRoot={fstRoot}/> :
                    item.type === "dataSource" ?
                        <DataSourcePanel key={key} item={item} 
                                         fstRoot={fstRoot}/> :
                    item.type === "directory" &&
                        <DirectoryPanel key={key} item={item}
                                        fstRoot={fstRoot}/>
                }
            </div>
        );
    }
}

export const FstItemPanel =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            fstRoot: state.fstRoot,
            item: fstWatcherSelectors.getFstItem(
                state.fstRoot,
                props.path,
                props.address
            )
        }),
        (dispatch, props) => ({ actions: {
            activateFile: bindActionCreators(explorerActions.activateFile,
                dispatch),
            fstList:      bindActionCreators(fstWatcherActions.list, dispatch),
        }})
)(FstItemPanelClass) as React.ComponentClass<InputProps>;
