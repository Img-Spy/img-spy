import * as React                   from "react";
import { actions as formActions }   from "react-redux-form";
import { Dispatch }                 from "react";
import { bindActionCreators }       from "redux";
import { connect }                  from "react-redux";
import { Action }                   from "redux-actions";

import { SettingsState }            from "store";
import { FixedTable }               from "img-spy-material";
import { Navigator,
         navigateUtils }            from "img-spy-navigation";
import { DataSource,
         settingsActions }          from "img-spy-modules/settings";
import { settingsWindowActions }    from "img-spy-modules/settings-window";
import { dataSourceTypes,
         dataSourceFileActions }    from "img-spy-modules/fst-watcher";


interface InputProps {}

interface StateProps {
    sources: { [id: string]: DataSource };
    selectedSource: DataSource;
}

interface DispatchProps {
    actions: {
        selectSource: (source: DataSource) => void;
        unselectSource: () => void;
        deleteSource: (source: string) => void;
        addSource: () => void;
        editSource: (source: DataSource) => void;
    }
}

type SourcesListProps = InputProps & StateProps & DispatchProps;

/////////

class SourcesListClass extends React.Component<SourcesListProps> {
    public static displayName = "SourcesList";

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

/////////

const settingsNavigator: Navigator<DataSource> =
    navigateUtils.createNavigator("main.settingsLeftBar.dataSourceSlider");
const editSource =
    (dispatch: Dispatch<Action<any>>) => (dataSource?: DataSource) => {
        let args;
        if (!dataSource) {
            const type = dataSourceTypes.DISK,
                    fileAction = dataSourceFileActions.MOVE;
            args = { type, fileAction };
        } else {
            args = dataSource;
        }

        dispatch(formActions.change("dataSource", args) as any);
        return settingsNavigator("edit-source");
    };
const unselectSource = () => settingsWindowActions.selectSource(undefined);

export const SourcesList =
    connect<StateProps, DispatchProps, InputProps, SettingsState>(
        (state, props) => ({
            sources: state.settings.sources,
            selectedSource: state.settingsWindow.sources.selectedSource
        }), 
        (dispatch, props) => ({ actions: {
            selectSource:   bindActionCreators(
                settingsWindowActions.selectSource, dispatch),
            unselectSource: bindActionCreators(unselectSource, dispatch),
            addSource:      bindActionCreators(editSource(dispatch), dispatch),
            editSource:     bindActionCreators(editSource(dispatch), dispatch),
            deleteSource:   bindActionCreators(settingsActions.deleteSource,
                dispatch),
        }})
)(SourcesListClass) as React.ComponentClass<InputProps>;
