import * as React               from "react";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { ResizeModel,
         ResizePanel,
         resizeActions }        from "img-spy-resize";

import State                    from "@public/state";

import { SearchList }           from "./search-list";
import { SearchResults }        from "./search-results";
import { SearchForm }           from "./search-form";


interface InputProps {}

interface StateProps {}

interface DispatchProps {
    actions: {
        initializeResize: (initial: ResizeModel) => void;
    }
}

type SearchProps = InputProps & StateProps & DispatchProps;

//////////

export class SearchClass extends React.Component<SearchProps> {
    public static displayName = "Search";

    componentWillMount() {
        this.props.actions.initializeResize({
            size: undefined,
            name: "search",
            direction: "horizontal",
            items: [
                { current: { value: 20, units: "percent" } },
                { current: { value: 80, units: "percent" } },
            ]
        });

        this.props.actions.initializeResize({
            size: undefined,
            name: "searchBar",
            direction: "vertical",
            items: [
                { current: { value: 40, units: "percent" } },
                { current: { value: 60, units: "percent" } },
            ]
        });
    }

    public render() {
        return (
            <ResizePanel name="search" className="search">
                <ResizePanel name="searchBar" className="bar search-bar"
                             style={{ minWidth: "200px" }}>
                    <SearchForm style={{ minHeight: "170px" }}/>
                    <SearchList style={{ minHeight: "200px" }}/>
                </ResizePanel>
                <SearchResults style={{ minWidth: "400px" }}/>
            </ResizePanel>
        );
    }
}

//////////

export const Search =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({}),
        (dispatch, props) => ({ actions: {
            initializeResize: bindActionCreators(resizeActions.initialize,
                dispatch)
        }})
)(SearchClass) as React.ComponentClass<InputProps>;
