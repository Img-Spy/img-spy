import * as React               from "react";
import uuidv1                   from "uuid/v1";
import { connect }              from "react-redux";
import { bindActionCreators }   from "redux";
import { Form,
         actions as formActions,
         Control }              from "react-redux-form";

import { filter }               from "img-spy-core";
import { DataSource }           from "img-spy-modules/settings";
import { FstDirectory,
         fstWatcherSelectors }  from "img-spy-modules/fst-watcher";

import { CrtSearchPayload,
         SearchFormModel,
         searchActions }        from "@public/modules/search";
import State                    from "@public/state";


interface InputProps {}

interface StateProps {
    sources: {[path: string]: DataSource};
    searchFolder: FstDirectory;
}

interface DispatchProps {
    actions: {
        createSearch: (payload: CrtSearchPayload) => void;
        clearSearchForm: () => void;
    }
}

type SearchFormProps = InputProps & StateProps & DispatchProps & React.HTMLAttributes<HTMLDivElement>;

//////////

export class SearchTableClass
        extends React.Component<SearchFormProps, undefined> {
    public static displayName = "SearchForm";
    public static defaultProps = {
        className: ""
    };

    constructor(props?: SearchFormProps, context?: any) {
        super(props, context);

        //
        this.onSearch = this.onSearch.bind(this);
    }

    public onSearch(model: SearchFormModel) {
        const { needle } = model;
        const { sources, actions, searchFolder } = this.props;
        const { name: fName, imgPath, offset, inode, path } = searchFolder;
        const id = uuidv1();
        const date = new Date();
        const name = `${fName}-${needle}`;

        actions.createSearch({id, name, imgPath, date, path,
                              offset, inode, needle});
        actions.clearSearchForm();
    }

    public render(): JSX.Element {
        const { actions,
                searchFolder,
                className,
                sources,
                ...divProps } = this.props;
        let completePath;
        if (searchFolder) {
            completePath = fstWatcherSelectors.getFullPath(searchFolder);
        }

        return (
            <div {...divProps}
                 className={`bar-box ${className}`}>
                <div className="header">Search form</div>
                <div className="body margin">
                    <Form model="searchForm" className="search-form"
                          onSubmit={this.onSearch}>
                        <table>
                            <tbody>
                                <tr className="input-box"><td>
                                    <Control.text model=".needle"
                                                  placeholder="Needle"
                                                  required/>
                                </td></tr>
                                <tr className="input-box" title={completePath}><td>
                                    <Control.text model=".imgPath" required
                                                  placeholder="Search path"
                                                  defaultValue={completePath}
                                                  disabled/>
                                </td></tr>
                            </tbody>
                        </table>
                        <button className="btn primary">Search</button>
                    </Form>
                </div>
            </div>
        );
    }
}

//////////

const clearSearchForm = () => formActions.change("searchForm.needle", "");
export const SearchForm =
    connect<StateProps, DispatchProps, InputProps, State>(
        (state, props) => ({
            sources: state.settings.sources,
            searchFolder: filter<FstDirectory>(
                fstWatcherSelectors.getFstItem(
                    state.fstRoot,
                    state.explorer.activeFile.path,
                    state.explorer.activeFile.address
                ), 
                (currFstItem) => (
                    currFstItem.type === "directory" &&
                    currFstItem.address === "virtual"
                )
            )
        }),
        (dispatch, props) => ({ actions: {
            createSearch:    bindActionCreators(searchActions.createSearch,
                dispatch),
            clearSearchForm: bindActionCreators(clearSearchForm, dispatch)
        }})
)(SearchTableClass) as React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>>;
