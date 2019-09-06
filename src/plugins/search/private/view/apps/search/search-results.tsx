import * as React               from "react";
import { Subscription }         from "rxjs";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { ResizeObservable }     from "img-spy-core";

import { SearchInfo,
         TableSettings,
         searchActions, 
         searchSelectors }      from "@public/modules/search";
import State                    from "@public/state";

import { SearchTable }          from "./search-table";


interface InputProps { }

interface StateProps {
    search: SearchInfo;
    tableSettings: TableSettings;
}

interface DispatchProps {
    actions: {
        updateSearchTable: (payload: TableSettings) => void;
    };
}

type SearchResultsProps = InputProps & StateProps & DispatchProps & React.HTMLAttributes<HTMLDivElement>;

//////////

export class SearchResultsClass extends React.Component<SearchResultsProps> {
    public static displayName = "SearchResults";
    public static defaultProps = {
        className: ""
    };

    private resizeSubscription: Subscription;

    constructor(props?: SearchResultsProps, context?: any) {
        super(props, context);

        //
    }

    public onBoxAttached(box: HTMLDivElement) {
        if (box === null) {
            this.resizeSubscription.unsubscribe();
        } else {

            this.resizeSubscription = ResizeObservable
                .create(box, "object")
                .subscribe((size) => {
                    const tableContainer = box.childNodes[0] as HTMLDivElement;
                    const table =
                        tableContainer.childNodes[0] as HTMLDivElement;
                    if (!table) {
                        return;
                    }

                    const { actions, tableSettings } = this.props;
                    const scroll = table.offsetHeight - table.scrollHeight;

                    const expected = 33;
                    const n = (size.height - (73 + scroll)) / expected;
                    const pageSize = Math.floor(n);

                    const real = (size.height - (73 + scroll)) / pageSize;
                    const padding = ( real - 19 ) / 2;

                    if (tableSettings.props &&
                            tableSettings.props.pageSize === pageSize) {
                        actions.updateSearchTable({
                            rowVerticalPadding: padding
                        });
                        return;
                    }

                    actions.updateSearchTable({
                        rowVerticalPadding: padding,
                        props: {
                            pageSize,
                            defaultPageSize: pageSize
                        }
                    });
                });
        }
    }

    public render(): JSX.Element {
        const { actions,
                search,
                tableSettings,
                className,
                children,
                ...divProps } = this.props;

        return (
            <div {...divProps} className={`${className} outer-box margin`}>
                <div className="box scroll" style={{overflow: "hidden"}}>
                    { search &&
                        <SearchTable
                            search={search}
                            tableProps={tableSettings.props}
                        />
                    }
                </div>
            </div>
        );
    }
}

export const SearchResults =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            search: searchSelectors.getSelected(state),
            tableSettings: state.search.tableSettings
        }),
        (dispatch, props) => ({ actions: {
            updateSearchTable: bindActionCreators(
                searchActions.updateSearchTable, dispatch)
        }})
)(SearchResultsClass) as React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>>;
