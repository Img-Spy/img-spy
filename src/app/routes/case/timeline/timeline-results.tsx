import * as React               from "react";
import { Subscription }         from "rxjs";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";
import { TimelineItem }         from "tsk-js";

import { ImgSpyState,
         ResizeObservable,
         ResizeSize,
         TableSettings,
         TimelineInfo }         from "app/models";
import { ResizePanel }          from "app/components";
import { updateTableSettings }  from "app/actions";

import { TimelineTable }        from "./timeline-table";
import { TimelineGraph }        from "./timeline-graph";


interface InputTimelineResultsProps
        extends React.HTMLAttributes<HTMLDivElement> { }

interface TimelineResultsActions {
    updateTableSettings: (settings: Partial<TableSettings>) => void;
}

interface TimelineResultsMapProps
        extends React.HTMLAttributes<HTMLDivElement> {
    dispatch?: Dispatch<any>;
    actions?: TimelineResultsActions;

    timeline: TimelineInfo;
    tableSettings: TableSettings;
}

const mapStateToProps: MapStateToProps<TimelineResultsMapProps,
                                       InputTimelineResultsProps> =
    (state: ImgSpyState, props) => {
        const { selected, tableSettings } = state.timeline;
        const { [selected]: timeline } = state.timeline.timelines;
        const mapProps: TimelineResultsMapProps = { timeline, tableSettings };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<TimelineResultsMapProps,
                                             InputTimelineResultsProps> =
    (dispatch, props) => {
        const actions: TimelineResultsActions = {
            updateTableSettings: bindActionCreators(updateTableSettings,
                                                    dispatch),
        };

        return { actions } as any;
    };

type TimelineResultsProps = InputTimelineResultsProps & TimelineResultsMapProps;
export class TimelineResultsClass
        extends React.Component<TimelineResultsProps, undefined> {
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
                        actions.updateTableSettings({
                            rowVerticalPadding: padding
                        });
                        return;
                    }

                    actions.updateTableSettings({
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
                dispatch,
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

export const TimelineResults = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineResultsClass) as React.ComponentClass<InputTimelineResultsProps>;
