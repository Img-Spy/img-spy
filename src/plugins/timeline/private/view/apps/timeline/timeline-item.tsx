import * as React                   from "react";
import { remote }                   from "electron";
import { bindActionCreators }       from "redux";
import { connect }                  from "react-redux";
import { Action }                   from "redux-actions";

import { fstWatcherSelectors  }     from "img-spy-modules/fst-watcher";
import { ExportCsvData,
         exportActions }            from "img-spy-modules/export";

import { TimelineInfo,
         TimelineItem as TimelineItemModel,
         timelineActions }          from "@public/modules/timeline";
import State                        from "@public/state";
   

interface InputProps {
    timeline: TimelineInfo;
}

interface StateProps {
    folder: string;
    selectedTimeline: string;
}

interface DispatchProps {
    actions: {
        selectTimeline: (path: string) => void;
        deleteTimeline: (path: string) => void;
        exportTimeline: (path: string, items: Array<TimelineItemModel>) => void;
    }
}

type TimelineItemProps = StateProps & InputProps & DispatchProps;

//////////

export class TimelineItemClass
        extends React.Component<TimelineItemProps, undefined> {
    public static displayName = "TimelineItem";
    public static defaultProps = {
    };

    public menu: Electron.Menu;

    constructor(props?: TimelineItemProps, context?: any) {
        super(props, context);

        //
        this.onTimelineClick = this.onTimelineClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.exportItem = this.exportItem.bind(this);
    }

    public onTimelineClick(ev: React.MouseEvent<HTMLDivElement>,
                           timeline: TimelineInfo) {
        this.props.actions.selectTimeline(timeline.path);
    }

    private onContextMenu(ev: React.MouseEvent<HTMLDivElement>) {
        const { timeline, actions } = this.props;
        const { clientX: x, clientY: y } = ev;

        actions.selectTimeline(timeline.path);

        if (this.menu.items.length > 0) {
            const currWindow = remote.getCurrentWindow();
            setTimeout(() => {
                this.menu.popup({
                    window: currWindow,
                    x, y,
                    // async: true
                });
            });
        }
    }

    private get className(): string {
        const { selectedTimeline, timeline } = this.props;
        return "timeline-item dots" +
            (selectedTimeline === timeline.path ? " selected" : "");
    }

    public exportItem(): void {
        const { timeline, actions, folder } = this.props;

        const name = remote.dialog.showSaveDialog({
            title: "Export file",
            defaultPath: `${folder}/${timeline.name}`
        }, (path) => {
            if (path) {
                actions.exportTimeline(path, timeline.rawItems);
            }
        });
    }

    public componentWillMount() {
        const { timeline, actions } = this.props;

        this.menu = new remote.Menu();
        this.menu.append(new remote.MenuItem({
            label: "Export", click: this.exportItem
        }));
        this.menu.append(new remote.MenuItem({ type: "separator" }));
        this.menu.append(new remote.MenuItem({
            label: "Delete",
            click: () => actions.deleteTimeline(timeline.path)
        }));
    }

    public render() {
        const { timeline,
                folder,
                children,
                actions,
                ...divProps } = this.props;
        const completePath = fstWatcherSelectors.getFullPath(timeline);

        return (
            <div key={timeline.path} className={this.className}
                 title={completePath}
                 onContextMenu={this.onContextMenu}
                 onClick={e => this.onTimelineClick(e, timeline)}>
                {timeline.name}
            </div>
        );
    }
}

//////////

const exportFields = ["path", "name", "allocated", "inode", "actions", "date"];
const exportTimeline =
    (file: string, data: Array<TimelineItemModel>): Action<ExportCsvData> =>
    exportActions.exportCsv({ file, data, fields: exportFields});

export const TimelineItem = 
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            selectedTimeline: state.timeline.selected,
            folder: state.folder
        }),
        (dispatch, props) => ({ actions: {
            selectTimeline:  bindActionCreators(timelineActions.selectTimeline, 
                dispatch),
            deleteTimeline:  bindActionCreators(timelineActions.deleteTimeline,
                dispatch),
            exportTimeline:  bindActionCreators(exportTimeline, dispatch)
        }})
)(TimelineItemClass as any) as React.ComponentClass<InputProps>;
