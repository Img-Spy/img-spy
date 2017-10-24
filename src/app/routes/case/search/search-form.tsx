import * as React               from "react";
import * as uuidv1              from "uuid/v1";
import { Subscription }         from "rxjs";
import { bindActionCreators }   from "redux";
import { connect,
         Dispatch,
         MapDispatchToProps,
         MapStateToProps }      from "react-redux";
import { TimelineItem }         from "tsk-js";
import   ReactTable             from "react-table";
import { Form,
         actions as formActions,
         Control, }             from "react-redux-form";

import { ImgSpyState,
         SearchFormModel,
         CrtSearchPayload,
         FstDirectory,
         getFstItem,
         getFullPath,
         DataSource }           from "app/models";
import { createSearch }         from "app/actions";


interface InputSearchFormProps
        extends React.HTMLAttributes<HTMLDivElement> {
}

interface SearchFormActions {
    createSearch: (payload: CrtSearchPayload) => void;
    clearSearchForm: () => void;
}

interface SearchFormMapProps
        extends React.HTMLAttributes<HTMLDivElement> {
    dispatch?: Dispatch<any>;
    actions?: SearchFormActions;

    sources: {[path: string]: DataSource};
    searchFolder: FstDirectory;
}

const mapStateToProps: MapStateToProps<SearchFormMapProps,
                                       InputSearchFormProps> =
    (state: ImgSpyState, props) => {
        const { sources } = state.settings;
        const { activeFile } = state.explorer;
        const currFstItem = getFstItem(state.fstRoot, activeFile.path,
                                       activeFile.address);
        const searchFolder =
            currFstItem.type === "directory" &&
            currFstItem.address === "virtual" ? currFstItem : undefined;


        const mapProps: SearchFormMapProps = { sources, searchFolder };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<SearchFormMapProps,
                                             InputSearchFormProps> =
    (dispatch, props) => {
        const clearSearchForm = () =>
            formActions.change("searchForm.needle", "");

        const actions: SearchFormActions = {
            createSearch:    bindActionCreators(createSearch,   dispatch),
            clearSearchForm: bindActionCreators(clearSearchForm, dispatch)
        };

        return { actions } as any;
    };

type SearchFormProps = InputSearchFormProps & SearchFormMapProps;
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
                dispatch,
                searchFolder,
                className,
                sources,
                ...divProps } = this.props;
        let completePath;
        if (searchFolder) {
            completePath = getFullPath(searchFolder as any);
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

export const SearchForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchTableClass) as React.ComponentClass<InputSearchFormProps>;
