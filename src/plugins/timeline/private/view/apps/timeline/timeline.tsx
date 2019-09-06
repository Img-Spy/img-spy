import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";

import { ResizeModel,
         ResizePanel,
         resizeActions }        from "img-spy-resize";

import State                    from "@public/state";

import { TimelineList }         from "./timeline-list";
import { TimelineResults }      from "./timeline-results";


interface InputProps {}

interface StateProps {}

interface DispatchProps {
    actions: {
        initializeResize: (initial: ResizeModel) => void;
    }
}

type TimelineProps = InputProps & StateProps & DispatchProps;

//////////

export class TimelineClass extends React.Component<TimelineProps> {
    public static displayName = "Timeline";

    componentWillMount() {
        this.props.actions.initializeResize({
            size: undefined,
            name: "timeline",
            direction: "horizontal",
            items: [
                { current: { value: 20, units: "percent" } },
                { current: { value: 80, units: "percent" } },
            ]
        });

        this.props.actions.initializeResize({
            size: undefined,
            name: "timelineResults",
            direction: "vertical",
            items: [
                { current: { value: 50, units: "percent" } },
                { current: { value: 50, units: "percent" } },
            ]
        });
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

//////////

export const Timeline =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({}),
        (dispatch, props) => ({ actions: {
            initializeResize: bindActionCreators(resizeActions.initialize,
                dispatch)
        }})
)(TimelineClass) as React.ComponentClass<InputProps>;
