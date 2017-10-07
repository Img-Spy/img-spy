import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";
import { Widget }               from "@phosphor/widgets";

import { ImgSpyState,
         getFstItem,
         FstFile,
         FstRoot,
         FstDataSource,
         FstDirectory,
         FstItem }              from "app/models";
import { selectFile,
         fstList,
         activateFile }         from "app/actions";

import { EditorPanel }          from "./editor-panel";
import { DirectoryPanel }       from "./directory-panel";
import { FilePanel }            from "./file-panel";


interface InputFstItemPanelPanelProps {
    path: string;
    address: string;
    widget?: Widget;
}

interface FstItemPanelActions {
    activateFile: (item: FstItem) => void;
    fstList: (dir: FstDirectory) => void;
}

interface FstItemPanelProps {
    widget?: Widget;
    path?: string;
    address?: string;
    fstRoot?: FstRoot;
    item?: FstItem;

    actions?: FstItemPanelActions;
}

const mapStateToProps: MapStateToProps<FstItemPanelProps, InputFstItemPanelPanelProps> =
    (state: ImgSpyState, props) => {
        const { fstRoot } = state;
        const item: FstItem = getFstItem(fstRoot, props.path, props.address);
        const mapProps: FstItemPanelProps = { item, fstRoot };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<FstItemPanelProps, InputFstItemPanelPanelProps> =
    (dispatch, props) => {
        const actions: FstItemPanelActions = {
            activateFile: bindActionCreators(activateFile, dispatch),
            fstList: bindActionCreators(fstList, dispatch),
        };

        return { actions } as any;
    };


export class FstItemPanelClass extends React.Component<FstItemPanelProps, undefined> {

    constructor(props?: FstItemPanelProps, context?: any) {
        super(props, context);
    }

    public DataSourcePanel(props: {item: FstDataSource}): JSX.Element {
        return null;
    }

    public render() {
        const { DataSourcePanel } = this;
        const { item, fstRoot, actions } = this.props;
        const key = `${item.address}-${item.path}`;

        if (this.props.widget) {
            this.props.widget.title.label = this.props.item.name;
            this.props.widget.title.closable = true;
        }

        return (
            <div className="fst-item-panel outer-box margin">
                {
                    item.type === "file" ?
                        <FilePanel key={key} item={item} fstRoot={fstRoot}/> :
                    item.type === "dataSource" ?
                        <DataSourcePanel key={key} item={item}/> :
                    item.type === "directory" &&
                        <DirectoryPanel key={key} item={item}
                                        fstRoot={fstRoot}/>
                }
            </div>
        );
    }
}

export const FstItemPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(FstItemPanelClass) as React.ComponentClass<InputFstItemPanelPanelProps>;
