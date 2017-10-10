import * as React               from "react";
import { Subscription }         from "rxjs";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";
import { TimelineItem }         from "tsk-js";
import   ReactTable             from "react-table";

import { ImgSpyState,
         TableSettings,
         SearchItem,
         SearchInfo }           from "app/models";
import { FixedTable }           from "app/components";
import { updateSearch }         from "app/actions";


interface InputSearchTableProps
        extends React.HTMLAttributes<HTMLDivElement> {
    search: SearchInfo;
    tableProps: TableSettings;
}

interface SearchTableActions {
    updateSearch: (searchResult: Partial<SearchInfo>) => void;
}

interface SearchTableMapProps
        extends React.HTMLAttributes<HTMLDivElement> {
    dispatch?: Dispatch<any>;
    actions?: SearchTableActions;
}

const mapStateToProps: MapStateToProps<SearchTableMapProps,
                                       InputSearchTableProps> =
    (state: ImgSpyState, props) => {
        const mapProps: SearchTableMapProps = { };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<SearchTableMapProps,
                                             InputSearchTableProps> =
    (dispatch, props) => {
        const actions: SearchTableActions = {
            updateSearch: bindActionCreators(updateSearch, dispatch),
        };

        return { actions } as any;
    };

type SearchTableProps = InputSearchTableProps & SearchTableMapProps;
export class SearchTableClass
        extends React.Component<SearchTableProps, undefined> {
    public static displayName = "SearchTable";
    public static defaultProps = {
        className: ""
    };

    constructor(props?: SearchTableProps, context?: any) {
        super(props, context);

        //
    }

    public render(): JSX.Element {
        const { search, tableProps, actions } = this.props;
        const data = Object
            .keys(search.rawItems || {})
            .map(key => search.rawItems[key]);

        const fullTableProps = {
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
            pivotBy: ["path"]
        };

        return <ReactTable ref="" {...fullTableProps}/>;
    }
}

export const SearchTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchTableClass) as React.ComponentClass<InputSearchTableProps>;
