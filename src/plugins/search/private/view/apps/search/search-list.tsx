import * as React               from "react";
import { connect }              from "react-redux";

import { SearchInfo }           from "@public/modules/search";
import State                    from "@public/state";

import { SearchItem }           from "./search-item";


interface InputProps {

}

interface StateProps {
    searchResults: {[id: string]: SearchInfo};
}

interface DispatchProps {
    actions: {

    }
}

type SearchListProps = InputProps & StateProps & DispatchProps & React.HTMLAttributes<HTMLDivElement>; 

//////////

export class TimelineListClass extends React.Component<SearchListProps> {
    public static displayName = "SearchList";
    public static defaultProps = {
        className: ""
    };

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

//////////

export const SearchList = 
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            searchResults: state.search.searchResults
        }),
)(TimelineListClass) as React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>>;
