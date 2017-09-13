
declare interface ReduxConnector<P> {
    (mapState, mapDispatch): F<P>;
}

declare interface F<P> {
    (a: React.ComponentClass<any>): React.ComponentClass<P>;
}
