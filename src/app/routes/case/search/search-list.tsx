import * as React               from "react";
import * as ReactDOM            from "react-dom";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";

import { ImgSpyState,
         SearchInfo }           from "app/models";
import { selectTimeline }       from "app/actions";

import { SearchItem }           from "./search-item";


interface InputSearchListProps
        extends React.HTMLAttributes<HTMLDivElement> {

}

interface SearchListActions {
}

interface SearchListMapProps
        extends React.HTMLAttributes<HTMLDivElement> {
    dispatch?: Dispatch<any>;
    actions?: SearchListActions;

    searchResults: {[id: string]: SearchInfo};
}

const mapStateToProps: MapStateToProps<SearchListMapProps,
                                       InputSearchListProps> =
    (state: ImgSpyState, props) => {
        const { searchResults } = state.searchView;
        const mapProps: SearchListMapProps = { searchResults };

        return mapProps as any;
    };

type SearchListProps = SearchListMapProps & InputSearchListProps;
export class TimelineListClass extends React.Component<SearchListProps, undefined> {
    public static displayName = "SearchList";
    public static defaultProps = {
        className: ""
    };

    constructor(props?: SearchListProps, context?: any) {
        super(props, context);

        //
    }

    public get searchList(): Array<SearchInfo> {
        return Object
            .keys(this.props.searchResults || {})
            .map(id => this.props.searchResults[id])
            .sort((tA, tB) => (
                tA.date > tB.date ? 1 :
                tB.date > tA.date ? -1 : 0
            ));
    }

    public render() {
        const { className,
                searchResults,
                dispatch,
                children,
                actions,
                ...divProps } = this.props;
        const { searchList } = this;

        return (
            <div className="bar-box">
                <div className="header">Search list</div>
                <div className="body scroll">
                    <div className="search-items">
                        { searchList.map(search =>
                            <SearchItem key={search.id} search={search}/>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export const SearchList = connect(
    mapStateToProps,
)(TimelineListClass) as React.ComponentClass<InputSearchListProps>;
