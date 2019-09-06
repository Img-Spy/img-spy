import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { fstWatcherSelectors,
         fstWatcherActions,
         FstRoot,
         FstItem,
         FstDirectory, 
         FstDataSource}         from "img-spy-modules/fst-watcher";
import { FixedTable }           from "img-spy-material";

import { explorerActions }      from "@public/modules/explorer";
import State                    from "@public/state";


interface InputProps {
    item: FstDataSource;
    fstRoot: FstRoot;
}

interface StateProps {}

interface DispatchProps {
    actions: {
        selectFile: (item?: FstItem) => void;
        activateFile: (item?: FstItem) => void;
        fstList: (dir: FstDirectory) => void;
    };
}

type DataSourcePanelProps = InputProps & StateProps & DispatchProps;

//////////

export class DataSourcePanelClass extends React.Component<DataSourcePanelProps> {
    public static displayName = "DirectoryPanel";

    public render() {
        const { item, fstRoot } = this.props;
        const children = fstWatcherSelectors.getFstChildren(fstRoot, item);

        return (
            <div className="directory-panel box scroll">
                <FixedTable.Table className="full-width"
                                  columnWidths={[null, null]}>
                    <FixedTable.Header>
                        <FixedTable.Cell>Name</FixedTable.Cell>
                        <FixedTable.Cell>Type</FixedTable.Cell>
                    </FixedTable.Header>
                    <FixedTable.Body>
                        { fstWatcherSelectors.getSortedChildren(children).map((fileName, i) =>
                            <FixedTable.Row key={i} clickable={true}
                                            onClick={() => this.props.actions.activateFile(children[fileName])}>
                                <FixedTable.Cell>{children[fileName].name}</FixedTable.Cell>
                                <FixedTable.Cell>partition</FixedTable.Cell>
                            </FixedTable.Row>
                        )}
                    </FixedTable.Body>
                </FixedTable.Table>
            </div>
        );
    }
}

//////////

export const DataSourcePanel =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({}),
        (dispatch, props) => ({actions: {
            selectFile:   bindActionCreators(explorerActions.selectFile, 
                dispatch),
            activateFile: bindActionCreators(explorerActions.activateFile,
                dispatch),
            fstList:      bindActionCreators(fstWatcherActions.list, dispatch),
        }})
)(DataSourcePanelClass) as React.ComponentClass<InputProps>;
