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


interface InputTimelineGraphProps
        extends React.HTMLAttributes<HTMLDivElement> {
    timeline: TimelineInfo;
}

interface TimelineGraphActions {
    updateTimeline: (timeline: Partial<TimelineInfo>) => void;
}

interface TimelineGraphMapProps
        extends React.HTMLAttributes<HTMLDivElement> {
    dispatch?: Dispatch<any>;
    actions?: TimelineGraphActions;
}

const mapStateToProps: MapStateToProps<TimelineGraphMapProps,
                                       InputTimelineGraphProps> =
    (state: ImgSpyState, props) => {
        const mapProps: TimelineGraphMapProps = { };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<TimelineGraphMapProps,
                                             InputTimelineGraphProps> =
    (dispatch, props) => {
        const actions: TimelineGraphActions = {
            updateTimeline:      bindActionCreators(updateTimeline, dispatch),
        };

        return { actions } as any;
    };

type TimelineGraphProps = InputTimelineGraphProps & TimelineGraphMapProps;
export class TimelineTableClass
        extends React.Component<TimelineGraphProps, undefined> {
    public static displayName = "TimelineGraph";
    public static defaultProps = {
    };

    constructor(props?: TimelineGraphProps, context?: any) {
        super(props, context);

        //
    }

    public render(): JSX.Element {
        const { timeline, actions } = this.props;

        const data = {
            datasets: [
                {
                    data: timeline.rawItems.map((it, i) => it.date)
                }
            ]
          };

        return (
            null
        );
    }
}

export const TimelineGraph = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineTableClass) as React.ComponentClass<InputTimelineGraphProps>;
