import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";
import { Widget }               from "@phosphor/widgets";

import { FixedTable }           from "app/components";
import { ImgSpyState,
         getFstItem,
         FstFile,
         FstDataSource,
         FstDirectory,
         FstItem }              from "app/models";
import { selectFile,
         activateFile }         from "app/actions";

import { EditorPanel }          from "./editor-panel";
import { FstItemPanel }         from "./fst-item-panel";


interface InputActivePanelPanelProps {
    widget?: Widget;
}

interface ActivePanelProps {
    activeItem?: FstItem;
    widget?: Widget;
}

const mapStateToProps: MapStateToProps<ActivePanelProps, InputActivePanelPanelProps> =
    (state: ImgSpyState, props) => {
        const activeItemSelector = state.explorer.activeFile;
        const activeItem: FstItem = getFstItem(
            state.fstRoot,
            activeItemSelector.path,
            activeItemSelector.address
        );
        const mapProps: ActivePanelProps = { activeItem };

        return mapProps as any;
    };

export class ActivePanelClass extends React.Component<ActivePanelProps, undefined> {
    public render() {
        const { activeItem } = this.props;

        if (this.props.widget) {
            this.props.widget.title.label = `Active (${this.props.activeItem.name})`;
            this.props.widget.title.closable = false;
        }

        return (
            <FstItemPanel path={activeItem.path} address={activeItem.address}/>
        );
    }
}

export const ActivePanel = connect(
    mapStateToProps,
    null
)(ActivePanelClass) as React.ComponentClass<InputActivePanelPanelProps>;
