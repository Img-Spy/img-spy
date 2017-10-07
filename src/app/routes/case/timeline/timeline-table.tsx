import * as React               from "react";
import { Subscription }         from "rxjs";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";
import { TimelineItem }         from "tsk-js";
import   ReactTable             from "react-table";

import { ImgSpyState,
         TableSettings,
         TimelineInfo }         from "app/models";
import { FixedTable }           from "app/components";
import { updateTimeline }       from "app/actions";


interface InputTimelineTableProps
        extends React.HTMLAttributes<HTMLDivElement> {
    timeline: TimelineInfo;
    tableProps: TableSettings;
}

interface TimelineTableActions {
    updateTimeline: (timeline: Partial<TimelineInfo>) => void;
}

interface TimelineTableMapProps
        extends React.HTMLAttributes<HTMLDivElement> {
    dispatch?: Dispatch<any>;
    actions?: TimelineTableActions;
}

const mapStateToProps: MapStateToProps<TimelineTableMapProps,
                                       InputTimelineTableProps> =
    (state: ImgSpyState, props) => {
        const mapProps: TimelineTableMapProps = { };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<TimelineTableMapProps,
                                             InputTimelineTableProps> =
    (dispatch, props) => {
        const actions: TimelineTableActions = {
            updateTimeline:      bindActionCreators(updateTimeline, dispatch),
        };

        return { actions } as any;
    };

type TimelineTableProps = InputTimelineTableProps & TimelineTableMapProps;
export class TimelineTableClass
        extends React.Component<TimelineTableProps, undefined> {
    public static displayName = "TimelineTable";
    public static defaultProps = {
        className: ""
    };

    constructor(props?: TimelineTableProps, context?: any) {
        super(props, context);

        //
    }

    public componentDidMount() {
        console.log(this.refs);
    }

    public render(): JSX.Element {
        const { timeline, tableProps, actions } = this.props;

        const fullTableProps = {
            ...tableProps,
            ...timeline.tableSettings,

            className: "-striped -highlight",
            data: timeline.sortedItems,
            columns: [{
                Header: "Path",
                accessor: "path"
            }, {
                id: "actions",
                Header: "Actions",
                width: 96,
                accessor: (t: TimelineItem) => t.actions
                    .map(a => a.substr(0, 2))
                    .join(","),
            }, {
                Header: "Date",
                accessor: "date",
                width: 209,
            }, {
                Header: "Inode",
                accessor: "inode",
                width: 99,
            }],
            onSortedChange: (defaultSorted) => {
                actions.updateTimeline({
                    path: timeline.path,
                    tableSettings: {
                        ...timeline.tableSettings,
                        defaultSorted
                    }
                });
            }
        };

        console.log("Redraw");
        return <ReactTable ref="" {...fullTableProps}/>;
    }
}

export const TimelineTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineTableClass) as React.ComponentClass<InputTimelineTableProps>;
