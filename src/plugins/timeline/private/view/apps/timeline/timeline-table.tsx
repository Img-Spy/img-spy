import * as React               from "react";
import   ReactTable             from "react-table";
import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { TimelineInfo,
         TimelineItem,
         TableSettings,
         timelineActions }      from "@public/modules/timeline";
import State                    from "@public/state";


interface InputProps {
    timeline: TimelineInfo;
    tableProps: TableSettings;
}

interface StateProps {}

interface DispatchProps {
    actions: {
        updateTimeline: (timeline: Partial<TimelineInfo>) => void;
    }
}

type TimelineTableProps = InputProps & StateProps & DispatchProps & React.HTMLAttributes<HTMLDivElement>;

//////////

export class TimelineTableClass extends React.Component<TimelineTableProps> {
    public static displayName = "TimelineTable";
    public static defaultProps = {
        className: ""
    };

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

        return <ReactTable {...fullTableProps}/>;
    }
}

export const TimelineTable =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({}),
        (dispatch, props) => ({ actions: {
            updateTimeline: bindActionCreators(timelineActions.updateTimeline,
                dispatch), 
        }})
)(TimelineTableClass) as React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>>;
