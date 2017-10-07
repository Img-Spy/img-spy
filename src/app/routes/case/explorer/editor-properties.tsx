import * as React           from "react";
import { connect,
         MapStateToProps }  from "react-redux";
import { Form,
         Control }          from "react-redux-form";

import { ImgSpyState,
         getFstItem,
         FstDataSource,
         FstItem }          from "app/models";


interface InputExplorerPropertiesProps {

}

interface ExplorerPropertiesProps {
    activeFstItem?: FstItem;
}

const mapStateToProps: MapStateToProps<ExplorerPropertiesProps, InputExplorerPropertiesProps> =
    (state: ImgSpyState, props) => {
        const activePath = state.explorer.activeFile,
              activeFstItem = (activePath !== undefined) ?
                    getFstItem(
                        state.fstRoot,
                        activePath.path,
                        activePath.address
                    ) : undefined;

        const mapProps: ExplorerPropertiesProps = { activeFstItem };

        return mapProps as any;
    };

export class ExplorerPropertiesClass extends React.Component<ExplorerPropertiesProps, undefined> {

    public DataSourceProperties(props: { item: FstDataSource }): JSX.Element {
        const { item } = props;

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
                                <Control.text model=".imgType" disabled={true}/>
                            </td>
                        </tr>
                        { item.imgType === "disk" &&
                            <tr className="input-box">
                                <td><label>Partitions</label></td>
                                <td>
                                    <Control.text model=".partitions.length" disabled={true}/>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </Form>
        );
    }

    public render() {
        const { DataSourceProperties } = this;
        const { activeFstItem : item } = this.props;

        return !!item && (
            <div className="bar-box explorer-properties">
                <div className="header">
                    Properties
                </div>
                <div className="body scroll">
                    <div className="background-box"/>
                    {
                        item.type === "file" ?
                            <div/> :
                        item.type === "directory" ?
                            <div/> :
                        item.type &&
                            <DataSourceProperties item={item}/>
                    }
                </div>
            </div>
        );
    }
}

export const ExplorerProperties = connect(mapStateToProps)(ExplorerPropertiesClass) as React.ComponentClass<InputExplorerPropertiesProps>;
