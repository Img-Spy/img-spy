import * as React               from "react";
import { Widget }               from "@phosphor/widgets";

import { connect }              from "react-redux";
import { FstItem,
         fstWatcherSelectors }  from "img-spy-modules/fst-watcher";

import ExplorerState            from "@public/state";

import { FstItemPanel }         from "./fst-item-panel";


interface InputProps {
    widget?: Widget;
}

interface StateProps {
    activeItem?: FstItem;
    widget?: Widget;
}

interface DispatchProps {}

//////////

type ActivePanelProps = InputProps & StateProps & DispatchProps;
export class ActivePanelClass
        extends React.Component<ActivePanelProps, undefined> {
    public static displayName = "ActivePanel";

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

//////////

export const ActivePanel =
    connect<StateProps, DispatchProps, InputProps, ExplorerState>(
        (state, props) => ({
            activeItem: fstWatcherSelectors.getFstItem(
                state.fstRoot,
                state.explorer.activeFile.path,
                state.explorer.activeFile.address
            )
        })
)(ActivePanelClass) as React.ComponentClass<InputProps>;
