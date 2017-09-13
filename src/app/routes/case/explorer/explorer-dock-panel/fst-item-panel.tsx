import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";
import { Widget }               from "@phosphor/widgets";

import { ImgSpyState,
         getFstItem,
         FstFile,
         FstDataSource,
         FstDirectory,
         FstItem }              from "app/models";
import { selectFile,
         activateFile }         from "app/actions";

import { EditorPanel }          from "./editor-panel";
import { DirectoryPanel }       from "./directory-panel";


interface InputFstItemPanelPanelProps {
    path: string;
    widget?: Widget;
}

interface FstItemPanelActions {
    activateFile: (path: string) => void;
}

interface FstItemPanelProps {
    widget?: Widget;
    path?: string;
    item?: FstItem;

    actions?: FstItemPanelActions;
}

const mapStateToProps: MapStateToProps<FstItemPanelProps, InputFstItemPanelPanelProps> =
    (state: ImgSpyState, props) => {
        const item: FstItem = getFstItem(state.fstRoot, props.path);
        const mapProps: FstItemPanelProps = { item };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<FstItemPanelProps, InputFstItemPanelPanelProps> =
    (dispatch, props) => {
        const actions: FstItemPanelActions = {
            activateFile: bindActionCreators(activateFile, dispatch),
        };

        return { actions } as any;
    };


export class FstItemPanelClass extends React.Component<FstItemPanelProps, undefined> {

    constructor(props?: FstItemPanelProps, context?: any) {
        super(props, context);
    }

    public FilePanel(props: {item: FstFile}): JSX.Element {
        return null;
    }

    public DataSourcePanel(props: {item: FstDataSource}): JSX.Element {
        return null;
    }

    public render() {
        const { FilePanel, DataSourcePanel } = this;
        const { item } = this.props;

        if (this.props.widget) {
            this.props.widget.title.label = this.props.item.name;
            this.props.widget.title.closable = true;
        }

        return (
            <div className="file-panel">
                {
                    item.type === "file" ?
                        <FilePanel item={item}/> :
                    item.type === "dataSource" ?
                        <DataSourcePanel item={item}/> :
                    item.type === "directory" &&
                        <DirectoryPanel item={item}/>
                }
            </div>
        );
    }
}

export const FstItemPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(FstItemPanelClass) as React.ComponentClass<InputFstItemPanelPanelProps>;
