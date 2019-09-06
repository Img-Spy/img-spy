import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { TimelineInfo,
         timelineActions }      from "@public/modules/timeline";
import State                    from "@public/state";


interface InputProps extends React.HTMLAttributes<HTMLDivElement> {
    timeline: TimelineInfo;
}

interface StateProps {}

interface DispatchProps {
    actions: {
        updateTimeline: (timeline: Partial<TimelineInfo>) => void;
    }
}

type TimelineGraphProps = InputProps & StateProps & DispatchProps;

/////////

export class TimelineTableClass extends React.Component<TimelineGraphProps> {
    public static displayName = "TimelineGraph";
    public static defaultProps = {};

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

/////////

export const TimelineGraph =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({}),
        (dispatch, props) => ({ actions: {
            updateTimeline: bindActionCreators(timelineActions.updateTimeline,
                dispatch),
        }})
)(TimelineTableClass) as React.ComponentClass<InputProps>;
