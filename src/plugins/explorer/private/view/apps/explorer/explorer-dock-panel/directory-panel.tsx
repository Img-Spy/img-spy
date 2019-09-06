import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { fstWatcherSelectors,
         fstWatcherActions,
         FstRoot,
         FstItem,
         FstDirectory }         from "img-spy-modules/fst-watcher";
import { FixedTable }           from "img-spy-material";

import { explorerActions }      from "@public/modules/explorer";
import State                    from "@public/state";


interface InputProps {
    item: FstDirectory;
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

type DirectoryPanelProps = InputProps & StateProps & DispatchProps;

//////////

export class DirectoryPanelClass extends React.Component<DirectoryPanelProps> {
    public static displayName = "DirectoryPanel";

    public componentDidMount() {
        const { item, fstRoot } = this.props;
        if (item.address === "virtual" && item.type === "directory" &&
                item.loaded === undefined) {

            this.props.actions.fstList(item);
        }
    }

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
                                <FixedTable.Cell>{children[fileName].type}</FixedTable.Cell>
                            </FixedTable.Row>
                        )}
                    </FixedTable.Body>
                </FixedTable.Table>
            </div>
        );
    }
}

//////////

export const DirectoryPanel =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({}),
        (dispatch, props) => ({actions: {
            selectFile:   bindActionCreators(explorerActions.selectFile, 
                dispatch),
            activateFile: bindActionCreators(explorerActions.activateFile,
                dispatch),
            fstList:      bindActionCreators(fstWatcherActions.list, dispatch),
        }})
)(DirectoryPanelClass) as React.ComponentClass<InputProps>;
