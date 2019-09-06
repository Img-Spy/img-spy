import * as React               from "react";
import { remote }               from "electron";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";

import { SearchInfo,
         searchActions }        from "@public/modules/search";
import State                    from "@public/state";


interface InputProps {
    search: SearchInfo;
}

interface StateProps {
    selectedSearch: string;
}

interface DispatchProps {
    actions: {
        selectSearch: (path: string) => void;
        deleteSearch: (path: string) => void;
    }
}

type SearchItemProps = InputProps & StateProps & DispatchProps;

//////////

export class SearchItemClass extends React.Component<SearchItemProps, undefined> {
    public static displayName = "SearchItem";
    public static defaultProps = {
    };

    public menu: Electron.Menu;

    constructor(props?: SearchItemProps, context?: any) {
        super(props, context);

        //
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    public onSearchClick(ev: React.MouseEvent<HTMLDivElement>,
                           search: SearchInfo) {
        this.props.actions.selectSearch(search.id);
    }

    private onContextMenu(ev: React.MouseEvent<HTMLDivElement>) {
        const { search, actions } = this.props;
        const { clientX: x, clientY: y } = ev;

        actions.selectSearch(search.id);

        if (this.menu.items.length > 0) {
            const currWindow = remote.getCurrentWindow();
            setTimeout(() => {
                this.menu.popup({ 
                    window: currWindow, 
                    x, y,
                    // async: true
                });
            });
        }
    }

    private get className(): string {
        const { selectedSearch, search } = this.props;
        return "search-item dots" +
            (selectedSearch === search.id ? " selected" : "");
    }

    public componentWillMount() {
        const { search, actions } = this.props;

        this.menu = new remote.Menu();
        this.menu.append(new remote.MenuItem({
            label: "Delete",
            click: () => actions.deleteSearch(search.id)
        }));

    }

    public render() {
        const { search,
                selectedSearch,
                children,
                actions,
                ...divProps } = this.props;
        const { className } = this;

        return (
            <div key={search.id} className={className}
                 title={search.name}
                 onContextMenu={this.onContextMenu}
                 onClick={e => this.onSearchClick(e, search)}>
                {search.name}
            </div>
        );
    }
}

export const SearchItem =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            selectedSearch: state.search.selected
        }),
        (dispatch, props) => ({ actions: {
            selectSearch: bindActionCreators(searchActions.selectSearch,
                dispatch),
            deleteSearch: bindActionCreators(searchActions.deleteSearch,
                dispatch)
        }})
)(SearchItemClass as any) as React.ComponentClass<InputProps>;
