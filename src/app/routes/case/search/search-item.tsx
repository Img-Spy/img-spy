import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";
import { remote }               from "electron";

import { ImgSpyState,
         SearchInfo }           from "app/models";
import { ResizePanel }          from "app/components";
import { selectSearch,
         deleteSearch }       from "app/actions";


interface InputSearchItemProps {
    search: SearchInfo;
}

interface SearchItemActions {
    selectSearch: (path: string) => void;
    deleteSearch: (path: string) => void;
}

interface SearchItemMapProps {
    dispatch?: Dispatch<any>;
    actions?: SearchItemActions;

    selectedSearch: string;
}

const mapStateToProps: MapStateToProps<SearchItemMapProps,
                                       InputSearchItemProps> =
    (state: ImgSpyState, props) => {
        const { selected: selectedSearch } = state.searchView;
        const mapProps: SearchItemMapProps = { selectedSearch };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<SearchItemActions,
                                             InputSearchItemProps> =
    (dispatch, props) => {
        const actions: SearchItemActions = {
            selectSearch:  bindActionCreators(selectSearch,   dispatch),
            deleteSearch:  bindActionCreators(deleteSearch,   dispatch)
        };

        return { actions } as any;
    };

type SearchItemProps = SearchItemMapProps & InputSearchItemProps;
export class SearchItemClass extends React.Component<SearchItemProps, undefined> {
    public static displayName = "SearchItem";
    public static defaultProps = {
    };

    public menu: Electron.Menu;

    constructor(props?: SearchItemProps, context?: any) {
        super(props, context);

        //
        this.onTimelineClick = this.onTimelineClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    public onTimelineClick(ev: React.MouseEvent<HTMLDivElement>,
                           search: SearchInfo) {
        this.props.actions.selectSearch(search.id);
    }

    private onContextMenu(ev: React.MouseEvent<HTMLDivElement>) {
        const { search, actions } = this.props;
        const { screenX: x, screenY: y } = ev;

        actions.selectSearch(search.id);

        if (this.menu.items.length > 0) {
            const currWindow = remote.getCurrentWindow();
            setTimeout(() => {
                this.menu.popup(currWindow, { x, y, async: true });
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
                dispatch,
                children,
                actions,
                ...divProps } = this.props;
        const { className } = this;

        return (
            <div key={search.id} className={className}
                 title={search.name}
                 onContextMenu={this.onContextMenu}
                 onClick={e => this.onTimelineClick(e, search)}>
                {search.name}
            </div>
        );
    }
}

export const SearchItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchItemClass as any) as React.ComponentClass<InputSearchItemProps>;
