import * as React                   from "react";
import * as uuidv1                  from "uuid/v1";
import { bindActionCreators }       from "redux";
import { MapDispatchToProps,
         connect,
         MapStateToProps }          from "react-redux";
import { actions as formActions }   from "react-redux-form";

import { ImgSpyState,
         DataSource }               from "app/models";
import { FixedTable }               from "app/components";
import { selectSource,
         createNavigator,
         Navigator,
         deleteSource }             from "app/actions";
import { dataSourceTypes,
         dataSourceFileActions }      from "app/constants";

import { EditSource }               from "./edit-source";


interface InputSourcesListProps {

}

interface SourcesListActions {
    selectSource: (source: DataSource) => void;
    unselectSource: () => void;
    deleteSource: (source: string) => void;
    addSource: () => void;
    editSource: (source: DataSource) => void;
}

interface SourcesListProps {
    sources: { [id: string]: DataSource };
    selectedSource?: DataSource;

    actions?: SourcesListActions;
}


const mapStateToProps: MapStateToProps<SourcesListProps,
                                       InputSourcesListProps> =
    (state: ImgSpyState, props) => {
        const mapProps: SourcesListProps = {
            sources: state.settings.sources,
            selectedSource: state.settingsWindow.sources.selectedSource
        };
        return mapProps as any;
    };

const settingsNavigator: Navigator<DataSource> = createNavigator("main.settingsLeftBar.dataSourceSlider");

const mapDispachToProps: MapDispatchToProps<SourcesListProps,
                                            InputSourcesListProps> =
    (dispatch, props) => {
        const editSource = (dataSource?: DataSource) => {
            let args;
            if (!dataSource) {
                const type = dataSourceTypes.DISK,
                      fileAction = dataSourceFileActions.MOVE;
                args = { type, fileAction };
            } else {
                args = dataSource;
            }

            dispatch(formActions.change("dataSource", args));
            return settingsNavigator("edit-source");
        };
        const actions: SourcesListActions = {
            selectSource:   bindActionCreators(selectSource, dispatch),
            unselectSource: bindActionCreators(() => selectSource(undefined), dispatch),
            addSource:      bindActionCreators(editSource,   dispatch),
            editSource:     bindActionCreators(editSource,   dispatch),
            deleteSource:   bindActionCreators(deleteSource, dispatch),
        };

        return { actions } as any;
    };

export class SourcesListClass
    extends React.Component<SourcesListProps, undefined> {
    private unselectSource = () => {
        if (this.props.selectedSource) {
            this.props.actions.unselectSource();
        }
    };

    public get canEdit() {
        return !!this.props.selectedSource;
    }

    public get canDelete() {
        return !!this.props.selectedSource;
    }

    public onAddClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        this.props.actions.addSource();
    }

    public onEditClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        this.props.actions.editSource(this.props.selectedSource);
    }

    public onDeleteClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        this.props.actions.deleteSource(this.props.selectedSource.path);
        this.props.actions.unselectSource();
    }

    public onSourceClick(event: React.MouseEvent<HTMLDivElement>,
                         source: DataSource) {
        event.stopPropagation();
        this.props.actions.selectSource(source);
    }

    public componentWillMount() {
        window.addEventListener("click", this.unselectSource);
    }

    public componentWillUnmount() {
        window.removeEventListener("click", this.unselectSource);
    }

    public mapDataSources(mapCb: (dataSource: DataSource, index: number) => JSX.Element) {
        return Object.keys(this.props.sources).map((dataSourceId, i) => {
            const dataSource = this.props.sources[dataSourceId];
            return mapCb(dataSource, i);
        });
    }

    public render() {
        return (
            <div className="settings-tab flex column">
                <div className="header">
                    <h1>Data sources</h1>
                </div>
                <div className="body flex row flex-height-auto">
                    <FixedTable.Table className="flex-width-auto" columnWidths={[260, null]}>
                        <FixedTable.Header>
                            <FixedTable.Cell>Name</FixedTable.Cell>
                            <FixedTable.Cell>Type</FixedTable.Cell>
                        </FixedTable.Header>
                        <FixedTable.Body>
                        { this.mapDataSources((dataSource, i) =>
                            <FixedTable.Row key={i} clickable={true}
                                            selected={this.props.selectedSource === dataSource}
                                            onClick={(ev) => this.onSourceClick(ev, dataSource)}>
                                <FixedTable.Cell>{dataSource.name}</FixedTable.Cell>
                                <FixedTable.Cell>{dataSource.imgType}</FixedTable.Cell>
                            </FixedTable.Row>
                        )}
                        </FixedTable.Body>
                    </FixedTable.Table>
                    <div className="flex column center" style={{ width: "145px"}}>
                        <table>
                            <tbody>
                                <tr><td>
                                    <button className="btn full-width"
                                            onClick={(ev) => this.onAddClick(ev)}>Add</button>
                                </td></tr>
                                <tr><td>
                                    <button className="btn full-width"
                                            onClick={(ev) => this.onEditClick(ev)}
                                            disabled={!this.canEdit}>Edit</button>
                                </td></tr>
                                <tr><td>
                                    <button className="btn full-width"
                                            onClick={(ev) => this.onDeleteClick(ev)}
                                            disabled={!this.canDelete}>Delete</button>
                                </td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export const SourcesList =
    connect(mapStateToProps, mapDispachToProps)(SourcesListClass) as React.ComponentClass<InputSourcesListProps>;
