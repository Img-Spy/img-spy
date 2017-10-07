import * as React               from "react";
import * as ReactDOM            from "react-dom";
import { connect,
         Provider,
         MapStateToProps }      from "react-redux";

import { ImgSpyState }          from "app/models";
import { ResizePanel }          from "app/components";

import { TimelineList }         from "./timeline-list";
import { TimelineResults }      from "./timeline-results";


interface InputTimelineProps {
}

interface TimelineMapProps {

}

const mapStateToProps: MapStateToProps<TimelineMapProps, InputTimelineProps> =
    (state: ImgSpyState, props) => {
        const mapProps: TimelineMapProps = { };

        return mapProps as any;
    };

export class TimelineClass extends React.Component<TimelineMapProps, undefined> {
    public static displayName = "Timeline";
    public static defaultProps = {
        className: ""
    };

    constructor(props?: TimelineMapProps, context?: any) {
        super(props, context);

        //
    }

    public render() {
        return (
            <ResizePanel name="timeline" className="timline flex row flex-width-auto full-height">
                <TimelineList style={{ minWidth: "200px" }}/>
                <TimelineResults style={{ minWidth: "400px" }}/>
            </ResizePanel>
        );
    }
}

export const Timeline = connect(
    mapStateToProps
)(TimelineClass) as React.ComponentClass<InputTimelineProps>;
