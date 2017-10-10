import * as React               from "react";
import * as ReactDOM            from "react-dom";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";

import { ImgSpyState,
         TimelineInfo }         from "app/models";
import { ResizePanel }          from "app/components";
import { selectTimeline }       from "app/actions";

import { TimelineItem }         from "./timeline-item";


interface InputTimelineListProps
        extends React.HTMLAttributes<HTMLDivElement> {

}

interface TimelineListActions {
}

interface TimelineListMapProps
        extends React.HTMLAttributes<HTMLDivElement> {
    dispatch?: Dispatch<any>;
    actions?: TimelineListActions;

    timelines: {[path: string]: TimelineInfo};
}

const mapStateToProps: MapStateToProps<TimelineListMapProps,
                                       InputTimelineListProps> =
    (state: ImgSpyState, props) => {
        const { timelines } = state.timeline;
        const mapProps: TimelineListMapProps = { timelines };

        return mapProps as any;
    };

type TimelineListProps = TimelineListMapProps & InputTimelineListProps;
export class TimelineListClass extends React.Component<TimelineListProps, undefined> {
    public static displayName = "TimelineList";
    public static defaultProps = {
        className: ""
    };

    constructor(props?: TimelineListMapProps, context?: any) {
        super(props, context);

        //
    }

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
                dispatch,
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

export const TimelineList = connect(
    mapStateToProps,
)(TimelineListClass) as React.ComponentClass<InputTimelineListProps>;
