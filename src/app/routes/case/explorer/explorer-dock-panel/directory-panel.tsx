import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";

import { getFstChildren,
         getSortedChildren,
         FstRoot,
         FstItem,
         FstDirectory,
         ImgSpyState }          from "app/models";
import { FixedTable }           from "app/components";
import { activateFile,
         fstList,
         selectFile }           from "app/actions";


interface InputDirectoryPanelProps {
    item: FstDirectory;
    fstRoot: FstRoot;
}

interface DirectoryPanelActions {
    selectFile: (item?: FstItem) => void;
    activateFile: (item?: FstItem) => void;
    fstList: (dir: FstDirectory) => void;
}

interface DirectoryPanelMapProps {
    actions?: DirectoryPanelActions;
}

const mapStateToProps: MapStateToProps<DirectoryPanelMapProps, InputDirectoryPanelProps> =
    (state: ImgSpyState, props) => {
        const mapProps: DirectoryPanelMapProps = { };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<DirectoryPanelMapProps, InputDirectoryPanelProps> =
    (dispatch, props) => {
        const actions: DirectoryPanelActions = {
            selectFile:     bindActionCreators(selectFile,      dispatch),
            fstList:        bindActionCreators(fstList,         dispatch),
            activateFile:   bindActionCreators(activateFile,    dispatch),
        };

        return { actions } as any;
    };

type DirectoryPanelProps = InputDirectoryPanelProps & DirectoryPanelMapProps;

export class DirectoryPanelClass extends React.Component<DirectoryPanelProps, undefined> {
    public static displayName = "DirectoryPanel";

    public componentWillMount() {
        const { item, fstRoot } = this.props;
        if (item.address === "virtual" && item.type === "directory" &&
                item.loaded === undefined) {

            this.props.actions.fstList(item);
        }
    }

    public render() {
        const { item, fstRoot } = this.props;
        const children = getFstChildren(fstRoot, item);

        return (
            <div className="directory-panel box scroll">
                <FixedTable.Table className="full-width"
                                  columnWidths={[null, null]}>
                    <FixedTable.Header>
                        <FixedTable.Cell>Name</FixedTable.Cell>
                        <FixedTable.Cell>Type</FixedTable.Cell>
                    </FixedTable.Header>
                    <FixedTable.Body>
                        { getSortedChildren(children).map((fileName, i) =>
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

export const DirectoryPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(DirectoryPanelClass) as React.ComponentClass<InputDirectoryPanelProps>;
