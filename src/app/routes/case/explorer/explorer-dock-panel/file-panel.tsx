import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";

import { getFstChildren,
         getSortedChildren,
         TabModel,
         FstRoot,
         FstFile,
         ImgSpyState }          from "app/models";
import { Tabs,
         Router,
         Route }                from "app/components";
import { fstContent }           from "app/actions";


interface InputFilePanelProps {
    item: FstFile;
    fstRoot: FstRoot;
}

interface FilePanelActions {
    fstContent: (file: FstFile) => void;
}

interface FilePanelMapProps {
    actions?: FilePanelActions;
}

const mapStateToProps: MapStateToProps<FilePanelMapProps, InputFilePanelProps> =
    (state: ImgSpyState, props) => {
        const mapProps: FilePanelMapProps = { };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<FilePanelMapProps, InputFilePanelProps> =
    (dispatch, props) => {
        const actions: FilePanelActions = {
            fstContent:   bindActionCreators(fstContent,    dispatch),
        };

        return { actions } as any;
    };

type FilePanelProps = InputFilePanelProps & FilePanelMapProps;

export class FilePanelClass extends React.Component<FilePanelProps, undefined> {
    public static displayName = "FilePanel";
    public maxLength = 1024;

    public componentWillMount() {
        this.checkContent();
    }

    public componentDidUpdate() {
        this.checkContent();
    }

    public checkContent(): void {
        const { item, fstRoot, actions } = this.props;

        if (!item.content) {
            console.log(`Lauch get content ${item.name}`);
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
            {path: "hex", text: "Hex View" },
            {path: "string", text: "String View" },
        ];

        const { item, fstRoot, actions } = this.props;

        if (!item.content) {
            return null;
        }

        return (
            <div className="file-panel flex column">
                <Tabs tabs={tabs} forRouter="main.caseApp.filePanel"/>
                <Router className="explorer-border flex-auto flex column"
                        name="main.caseApp.filePanel"
                        defaultRoute="hex"
                        style={{ marginTop: "-1px" }}>
                    <Route path="hex">
                        <div className="hex-view flex-auto">
                            <div className="selectable">
                                { this.content.toString("hex") }
                            </div>
                        </div>
                    </Route>
                    <Route path="string">
                        <div className="selectable string-view flex-auto">
                            <div className="selectable">
                                { this.content.toString() }
                            </div>
                        </div>
                    </Route>
                </Router>
            </div>
        );
    }
}

export const FilePanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(FilePanelClass) as React.ComponentClass<InputFilePanelProps>;
