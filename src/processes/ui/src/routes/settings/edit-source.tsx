import * as React               from "react";
import { ipcRenderer }          from "electron";
import { Form,
         Control }              from "react-redux-form";

import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { Navigator,
         navigateUtils }        from "img-spy-navigation";
import { DataSourceForm,
         DataSource,
         settingsActions }      from "img-spy-modules/settings";
import { Fa }                   from "img-spy-material";

import { SettingsState }        from "store";

interface InputProps {}

interface StateProps {
    dataSource: DataSourceForm;
}

interface DispatchProps {
    actions: {
        back: () => void;
        editSource: (source: DataSource) => void;
    }
}

type EditSourceProps = InputProps & StateProps & DispatchProps;

/////////

export class EditSourceClass extends React.Component<EditSourceProps> {

    public onBackClick(event: React.MouseEvent<undefined>) {
        ipcRenderer.send("log-terminal", {
            text: "Close settings"
        });
        this.props.actions.back();
    }

    public get fileName(): string {
        return this.props.dataSource.file ? this.props.dataSource.file[0].path : "";
    }

    public onSubmit(source: DataSourceForm) {
        // this.props.actions.editSource(source);
        this.props.actions.back();
    }

    public render() {
        return (
            <Form className="settings-tab flex column" model="dataSource" onSubmit={(source: DataSourceForm) => this.onSubmit(source)}>
                <div className="header">
                    <h1>
                        <Fa.Button icon="chevron-left"
                                   onClick={(ev) => this.onBackClick(ev)}
                                   style={{fontSize: "27px"}}/> Source editor
                    </h1>
                </div>
                <div className="body flex row flex-height-auto">
                    <table>
                        <tbody>
                            <tr className="input-box">
                                <td><label>Name</label></td>
                                <td>
                                    <Control.text model=".name"/>
                                </td>
                            </tr>
                            <tr className="input-box">
                                <td><label>Type</label></td>
                                <td>
                                    <Control.select model=".type">
                                        <option value="1">Disk</option>
                                        <option value="2">Partition</option>
                                    </Control.select>
                                </td>
                            </tr>
                            <tr className="input-box file">
                                <td><label>File</label></td>
                                <td>
                                    <Control.file id="dataSource.file" name="dataSource.file" model=".file"/>
                                    <label className="input-file" htmlFor="dataSource.file" title={this.fileName}>{this.fileName}</label>
                                </td>
                            </tr>
                            <tr className="input-box">
                                <td></td>
                                <td style={{ paddingBottom: "10px" }}>
                                    {/* <Control.radio value="copy" id="dataSource.fileAction.copy" model=".use"/>
                                    <label htmlFor="dataSource.fileAction.copy">Copy</label> */}
                                    <Control.radio value="move" id="dataSource.fileAction.move" model=".fileAction"/>
                                    <label htmlFor="dataSource.fileAction.move">Move</label>
                                    {/* <Control.radio value="link" id="dataSource.fileAction.link" model=".use"/>
                                    <label htmlFor="dataSource.fileAction.link">Link</label> */}
                                </td>
                            </tr>
                            <tr className="input-box">
                                <td><label>Hash (MD5)</label></td>
                                <td>
                                    <Control.text model=".hash"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex row end">
                    <button className="btn primary">Accept</button>
                </div>
            </Form>
        );
    }
}

/////////

const settingsNavigator: Navigator<DataSource> = 
    navigateUtils.createNavigator("main.settingsLeftBar.dataSourceSlider");
const back = () => settingsNavigator("sources-list");

export const EditSource =
    connect<StateProps, DispatchProps, InputProps, SettingsState>(
        (state, props) => ({
            dataSource: state.dataSource
        }),
        (dispatch, props) => ({ actions: {
            back: bindActionCreators(back, dispatch),
            editSource: bindActionCreators(settingsActions.updateSource,
                dispatch),
        }})
)(EditSourceClass) as React.ComponentClass<InputProps>;
