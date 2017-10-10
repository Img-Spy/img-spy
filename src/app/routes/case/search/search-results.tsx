import * as React               from "react";
import { Subscription }         from "rxjs";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";

import { ImgSpyState,
         ResizeObservable,
         ResizeSize,
         TableSettings,
         SearchInfo }           from "app/models";
import { updateSearchTable }    from "app/actions";

import { SearchTable }          from "./search-table";


interface InputSearchResultsProps
        extends React.HTMLAttributes<HTMLDivElement> { }

interface SearchResultsActions {
    updateSearchTable: (payload: TableSettings) => void;
}

interface SearchResultsMapProps
        extends React.HTMLAttributes<HTMLDivElement> {
    dispatch?: Dispatch<any>;
    actions?: SearchResultsActions;

    search: SearchInfo;
    tableSettings: TableSettings;
}

const mapStateToProps: MapStateToProps<SearchResultsMapProps,
                                       InputSearchResultsProps> =
    (state: ImgSpyState, props) => {
        const { selected, tableSettings } = state.searchView;
        const { [selected]: search } = state.searchView.searchResults;
        const mapProps: SearchResultsMapProps = { search, tableSettings };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<SearchResultsMapProps,
                                             InputSearchResultsProps> =
    (dispatch, props) => {
        const actions: SearchResultsActions = {
            updateSearchTable: bindActionCreators(updateSearchTable, dispatch),
        };

        return { actions } as any;
    };

type SearchResultsProps = InputSearchResultsProps & SearchResultsMapProps;
export class SearchResultsClass
        extends React.Component<SearchResultsProps, undefined> {
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
                dispatch,
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

export const SearchResults = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResultsClass) as React.ComponentClass<InputSearchResultsProps>;
