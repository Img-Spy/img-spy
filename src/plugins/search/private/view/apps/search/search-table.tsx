import * as React               from "react"
import   ReactTable, 
       { TableProps,
         ReactTableDefaults }   from "react-table";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { SearchInfo,
         TableSettings,
         searchActions, 
         SearchItem}            from "@public/modules/search";
import State                    from "@public/state";


interface InputProps {
    search: SearchInfo;
    tableProps: TableSettings;
}

interface StateProps {}

interface DispatchProps {
    actions: {
        updateSearch: (searchResult: Partial<SearchInfo>) => void;
    }
}

type SearchTableProps = InputProps & StateProps & DispatchProps & React.HTMLAttributes<HTMLDivElement>;

//////////

export class SearchTableClass extends React.Component<SearchTableProps> {
    public static displayName = "SearchTable";
    public static defaultProps = {
        className: ""
    };

    public render(): JSX.Element {
        const { search, tableProps, actions } = this.props;
        const data = search.rawItems;
        // Object
        //     .keys(search.rawItems || {})
        //     .map<SearchItem>(key => search.rawItems[key]);

        const fullTableProps: TableProps<SearchItem[]> = {
            ...ReactTableDefaults,
            ...tableProps,
            ...search.tableSettings,

            className: "-striped -highlight",
            data,
            columns: [{
                Header: " ",
                columns: [{
                    Header: "Path",
                    accessor: "path",
                    width: 300,
                }]
            }, {
                Header: "Matches",
                columns: [
                    {
                        Header: "Context",
                        aggregate: vals => " ",
                        accessor: "context",
                    },
                    {
                        Header: "Index",
                        aggregate: vals => " ",
                        width: 80,
                        accessor: "index",
                    }
                ],
            }],
            onSortedChange: (defaultSorted) => {
                actions.updateSearch({
                    id: search.id,
                    tableSettings: {
                        ...search.tableSettings,
                        defaultSorted
                    }
                });
            },
            // TODO: Fix pivot!!
            // pivotBy: ["path"]
        };

        return <ReactTable {...fullTableProps}/>;
    }
}

//////////

export const SearchTable =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({}),
        (dispatch, props) => ({ actions: {
            updateSearch: bindActionCreators(searchActions.updateSearch,
                dispatch),
        }})
)(SearchTableClass) as React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>>;
