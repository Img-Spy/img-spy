import * as React               from "react";
import { Subscription }         from "rxjs";
import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { ResizeObservable }     from "img-spy-core";

import { TimelineInfo,
         TableSettings,
         timelineActions, 
         timelineSelectors }    from "@public/modules/timeline";
import State                    from "@public/state";

import { TimelineTable }        from "./timeline-table";


interface InputProps {}

interface StateProps {
    timeline: TimelineInfo;
    tableSettings: TableSettings;
}

interface DispatchProps {
    actions: {
        updateTimelineTable: (settings: Partial<TableSettings>) => void;
    }
}

type TimelineResultsProps = InputProps & StateProps & DispatchProps & React.HTMLAttributes<HTMLDivElement>;

//////////

export class TimelineResultsClass 
        extends React.Component<TimelineResultsProps> {
    public static displayName = "TimelineResults";
    public static defaultProps = {
        className: ""
    };

    private resizeSubscription: Subscription;

    constructor(props?: TimelineResultsProps, context?: any) {
        super(props, context);

        //
        this.onBoxAttached = this.onBoxAttached.bind(this);
    }

    public onBoxAttached(box: HTMLDivElement) {
        if (box === null) {
            this.resizeSubscription.unsubscribe();
        } else {

            this.resizeSubscription = ResizeObservable
                .create(box, "object")
                .subscribe((size) => {
                    const tableContainer = box.childNodes[0] as HTMLDivElement;
                    const table =
                        tableContainer.childNodes[0] as HTMLDivElement;
                    if (!table) {
                        return;
                    }

                    const { actions, tableSettings } = this.props;
                    const scroll = table.offsetHeight - table.scrollHeight;

                    const expected = 33;
                    const n = (size.height - (73 + scroll)) / expected;
                    const pageSize = Math.floor(n);

                    const real = (size.height - (73 + scroll)) / pageSize;
                    const padding = ( real - 19 ) / 2;

                    if (tableSettings.props &&
                            tableSettings.props.pageSize === pageSize) {
                        actions.updateTimelineTable({
                            rowVerticalPadding: padding
                        });
                        return;
                    }

                    actions.updateTimelineTable({
                        rowVerticalPadding: padding,
                        props: {
                            pageSize,
                            defaultPageSize: pageSize
                        }
                    });
                });
        }
    }

    public render(): JSX.Element {
        const { timeline,
                tableSettings,
                actions,
                className,
                children,
                ...divProps } = this.props;

        return (
            <div {...divProps} className={`${className} outer-box margin`}>
                <style>{`
                    .ReactTable .rt-th, .ReactTable .rt-td {
                        padding: ${tableSettings.rowVerticalPadding}px 5px;
                    }
                `}</style>
                <div className="box scroll" ref={this.onBoxAttached}
                    style={{overflow: "hidden"}}>
                { timeline &&
                    <TimelineTable
                        timeline={timeline}
                        tableProps={tableSettings.props}
                    />
                }
                </div>
            </div>
        );
    }
}

//////////

export const TimelineResults =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            timeline: timelineSelectors.getSelected(state),
            tableSettings: state.timeline.tableSettings,
        }),
        (dispatch, props) => ({ actions: {
            updateTimelineTable: bindActionCreators(
                timelineActions.updateTimelineTable, dispatch),
        }})
)(TimelineResultsClass) as React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>>;
