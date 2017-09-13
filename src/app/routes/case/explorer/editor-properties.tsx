import * as React           from "react";
import { connect,
         MapStateToProps }  from "react-redux";
import { Form,
         Control }          from "react-redux-form";

import { ImgSpyState,
         getFstItem,
         FstItem }          from "app/models";


interface InputExplorerPropertiesProps {

}

interface ExplorerPropertiesProps {
    activeFstItem?: FstItem;
}

const mapStateToProps: MapStateToProps<ExplorerPropertiesProps, InputExplorerPropertiesProps> =
    (state: ImgSpyState, props) => {
        const activePath = state.caseWindow.activeFile,
              activeFstItem =
                    (activePath !== undefined) ? getFstItem(state.fstRoot, activePath) : undefined;
        const mapProps: ExplorerPropertiesProps = { activeFstItem };

        return mapProps as any;
    };

export class ExplorerPropertiesClass extends React.Component<ExplorerPropertiesProps, undefined> {

    public get isDirectory() {
        return this.props.activeFstItem.type === "directory";
    }

    public get isFile() {
        return this.props.activeFstItem.type === "file";
    }

    public get isDataSource() {
        return this.props.activeFstItem.type === "dataSource";
    }

    public render() {
        return !!this.props.activeFstItem && (
            <div className="explorer-bar-box flex column explorer-properties">
                <div className="header">
                    Properties
                </div>
                <div className="body flex-auto flex column">
                    {this.isDirectory ?  (
                        <div></div>
                    ) : this.isFile ? (
                        <div></div>
                    ) : this.isDataSource && (
                        this.renderDataSourceProperties()
                    )}
                </div>
            </div>
        );
    }

    public renderDataSourceProperties(): JSX.Element {
        return (
            <Form className="editor-properties-form flex-auto" model="fstItem">
                <table>
                    <tbody>
                        <tr className="input-box">
                            <td><label>Hash</label></td>
                            <td>
                                <Control.text model=".hash"/>
                            </td>
                        </tr>
                        <tr className="input-box">
                            <td><label>Type</label></td>
                            <td>
                                <Control.select model=".imgType">
                                    <option value="1">Disk</option>
                                    <option value="2">Partition</option>
                                </Control.select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Form>
        );
    }
}

export const ExplorerProperties = connect(mapStateToProps)(ExplorerPropertiesClass) as React.ComponentClass<InputExplorerPropertiesProps>;
