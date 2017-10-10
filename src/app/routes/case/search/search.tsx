import * as React               from "react";
import * as ReactDOM            from "react-dom";
import { connect,
         Provider,
         MapStateToProps }      from "react-redux";

import { ImgSpyState }          from "app/models";
import { ResizePanel }          from "app/components";

import { SearchList }           from "./search-list";
import { SearchResults }        from "./search-results";
import { SearchForm }           from "./search-form";


interface InputSearchProps {
}

interface SearchMapProps {

}

const mapStateToProps: MapStateToProps<SearchMapProps, InputSearchProps> =
    (state: ImgSpyState, props) => {
        const mapProps: SearchMapProps = { };

        return mapProps as any;
    };

export class SearchClass extends React.Component<SearchMapProps, undefined> {
    public static displayName = "Timeline";
    public static defaultProps = {
        className: ""
    };

    constructor(props?: SearchMapProps, context?: any) {
        super(props, context);

        //
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

export const Search = connect(
    mapStateToProps
)(SearchClass) as React.ComponentClass<InputSearchProps>;
