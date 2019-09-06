import * as React               from "react";
import { connect }              from "react-redux";

import { TimelineInfo }         from "@public/modules/timeline";
import State                    from "@public/state";

import { TimelineItem }         from "./timeline-item";


interface InputProps {}

interface StateProps {
    timelines: {[path: string]: TimelineInfo};
}

interface DispatchProps {
    actions: {

    }
}

type TimelineListProps = InputProps & StateProps & DispatchProps & React.HTMLAttributes<HTMLDivElement>;

//////////

export class TimelineListClass extends React.Component<TimelineListProps> {
    public static displayName = "TimelineList";
    public static defaultProps = {
        className: ""
    };

    public get timelinesList(): Array<TimelineInfo> {
        return Object
            .keys(this.props.timelines || {})
            .map(path => this.props.timelines[path])
            .sort((tA, tB) => (
                tA.date > tB.date ? 1 :
                tB.date > tA.date ? -1 : 0
            ));
    }

    public render() {
        const { className,
                timelines,
                children,
                actions,
                ...divProps } = this.props;
        const { timelinesList } = this;

        return (
            <div { ...divProps } className={`bar ${className}`}>
                <div className="bar-box">
                    <div className="header">Timeline list</div>
                    <div className="body scroll">
                        <div className="timeline-items">
                            { timelinesList.map(timeline =>
                                <TimelineItem key={timeline.path}
                                              timeline={timeline}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//////////

export const TimelineList =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            timelines: state.timeline.timelines
        }),
        (dispatch, props) => ({ actions: {

        }})
)(TimelineListClass) as React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>>;
