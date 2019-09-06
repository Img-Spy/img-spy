import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";
import { Form,
         Control }              from "react-redux-form";

import { FstItem,
         FstDataSource,
         fstWatcherSelectors }  from "img-spy-modules/fst-watcher";

import State                    from "@public/state";


interface InputProps {}

interface StateProps {
    activeFstItem: FstItem;
}

interface DispatchProps {}


type ExplorerPropertiesProps = InputProps & StateProps & DispatchProps;
export class ExplorerPropertiesClass
        extends React.Component<ExplorerPropertiesProps, undefined> {
    public static displayName = "ExplorerProperties";

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


export const ExplorerProperties =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            activeFstItem: state.explorer.activeFile ?
                fstWatcherSelectors.getFstItem(
                    state.fstRoot,
                    state.explorer.activeFile.path,
                    state.explorer.activeFile.address
                ) : undefined
        })
)(ExplorerPropertiesClass) as React.ComponentClass<InputProps>;
