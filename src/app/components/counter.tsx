import * as React from "react";
import { Component } from "react";

export interface ICounter {
    value: number;
}

export interface CounterProps {
    counter: ICounter;
    timeout: () => void;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Counter extends Component<CounterProps, undefined> {

    private timeout: NodeJS.Timer;

    public componentWillMount() {
        this.startTimer();
    }

    public componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    protected startTimer() {
        this.timeout = setInterval(() => {
            this.setState(this.tick);
        }, 1000);
    }

    protected tick(prevState: CounterProps, props: CounterProps) {
        props.counter.value++;
        if (props.counter.value === 5) {
            props.timeout();
        }
    }

    public render() {
        return  (
            <p>Running since {this.props.counter.value} seconds</p>
        );
    }
}
