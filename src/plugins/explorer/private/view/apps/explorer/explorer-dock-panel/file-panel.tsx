import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { TabModel,
         Tabs,
         Router,
         Route }                from "img-spy-navigation";
import { fstWatcherActions,
         FstRoot,
         FstFile }              from "img-spy-modules/fst-watcher";

import State                    from "@public/state";


interface InputProps {
    item: FstFile;
    fstRoot: FstRoot;
}

interface StateProps {}

interface DispatchProps {
    actions: {
        fstContent: (file: FstFile) => void;        
    }
}

type FilePanelProps = InputProps & StateProps & DispatchProps;

//////////

export class FilePanelClass extends React.Component<FilePanelProps> {
    public static displayName = "FilePanel";
    public maxLength = 1024;

    public componentDidMount() {
        const { item, actions } = this.props;

        if (!item.content) {
            console.log(`Lauch get content ${item.name} in did mount`);
            actions.fstContent(item);
        }
    }

    public componentDidUpdate() {
        const { item, actions } = this.props;

        if (!item.content) {
            console.log(`Lauch get content ${item.name} in did update`);
            actions.fstContent(item);
        }
    }

    public get content(): Buffer {
        const content = this.props.item.content;
        return content.length > this.maxLength ?
            content.slice(0, this.maxLength) :
            content;
    }

    public render() {
        const tabs: Array<TabModel> = [
            { path: "hex", text: "Hex View" },
            { path: "string", text: "String View" },
        ];

        const { item, fstRoot, actions } = this.props;

        if (!item.content) {
            return null;
        }

        return (
            <div className="file-panel box-container">
                <Tabs tabs={tabs} forRouter="main.caseApp.filePanel"/>
                <Router className="box padding scroll box-tabs"
                        name="main.caseApp.filePanel"
                        defaultRoute="hex">
                    <Route path="hex">
                        <div className="hex-view selectable">
                            { this.content.toString("hex") }
                        </div>
                    </Route>
                    <Route path="string">
                        <div className="string-view selectable">
                            { this.content.toString() }
                        </div>
                    </Route>
                </Router>
            </div>
        );
    }
}

//////////

export const FilePanel = 
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({}),
        (dispatch, props) => ({actions: {
            fstContent: bindActionCreators(fstWatcherActions.content, dispatch),
        }})
)(FilePanelClass) as React.ComponentClass<InputProps>;
