import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";
import { remote }               from "electron";

import { ImgSpyState,
         getFullPath,
         TimelineInfo }         from "app/models";
import { ResizePanel }          from "app/components";
import { selectTimeline,
         deleteTimeline }       from "app/actions";


interface InputTimelineItemProps {
    timeline: TimelineInfo;
}

interface TimelineItemActions {
    selectTimeline: (path: string) => void;
    deleteTimeline: (path: string) => void;
}

interface TimelineItemMapProps {
    dispatch?: Dispatch<any>;
    actions?: TimelineItemActions;

    selectedTimeline: string;
}

const mapStateToProps: MapStateToProps<TimelineItemMapProps,
                                       InputTimelineItemProps> =
    (state: ImgSpyState, props) => {
        const { selected: selectedTimeline } = state.timeline;
        const mapProps: TimelineItemMapProps = { selectedTimeline };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<TimelineItemActions,
                                             InputTimelineItemProps> =
    (dispatch, props) => {
        const actions: TimelineItemActions = {
            selectTimeline:  bindActionCreators(selectTimeline,   dispatch),
            deleteTimeline:  bindActionCreators(deleteTimeline,   dispatch)
        };

        return { actions } as any;
    };

type TimelineItemProps = TimelineItemMapProps & InputTimelineItemProps;
export class TimelineItemClass extends React.Component<TimelineItemProps, undefined> {
    public static displayName = "TimelineItem";
    public static defaultProps = {
    };

    public menu: Electron.Menu;

    constructor(props?: TimelineItemProps, context?: any) {
        super(props, context);

        //
        this.onTimelineClick = this.onTimelineClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    public onTimelineClick(ev: React.MouseEvent<HTMLDivElement>,
                           timeline: TimelineInfo) {
        this.props.actions.selectTimeline(timeline.path);
    }

    private onContextMenu(ev: React.MouseEvent<HTMLDivElement>) {
        const { timeline, actions } = this.props;
        const { screenX: x, screenY: y } = ev;

        actions.selectTimeline(timeline.path);

        if (this.menu.items.length > 0) {
            const currWindow = remote.getCurrentWindow();
            setTimeout(() => {
                this.menu.popup(currWindow, { x, y, async: true });
            });
        }
    }

    private get className(): string {
        const { selectedTimeline, timeline } = this.props;
        return "timeline-item dots" +
            (selectedTimeline === timeline.path ? " selected" : "");
    }

    public componentWillMount() {
        const { timeline, actions } = this.props;

        this.menu = new remote.Menu();
        this.menu.append(new remote.MenuItem({
            label: "Export",
            click: () => actions.deleteTimeline(timeline.path)
        }));
        this.menu.append(new remote.MenuItem({ type: "separator" }));
        this.menu.append(new remote.MenuItem({
            label: "Delete",
            click: () => actions.deleteTimeline(timeline.path)
        }));

    }

    public render() {
        const { timeline,
                dispatch,
                children,
                actions,
                ...divProps } = this.props;
        const completePath = getFullPath(timeline);

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

export const TimelineItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineItemClass as any) as React.ComponentClass<InputTimelineItemProps>;
