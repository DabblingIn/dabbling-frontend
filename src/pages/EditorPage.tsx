import * as React from 'react';

import { Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import DefaultNavbar from '../parts/DefaultNavbar/DefaultNavbar';
import EditorLoginForm from '../parts/EditorLoginForm/EditorLoginForm';
import EditArticlePanel from '../parts/EditArticlePanel/EditArticlePanel';
import EditorArticleListing from '../parts/EditorArticleListing/EditorArticleListing';

import { getSubdomainConfig } from '../subdomains';

//import ApiCaller from '../parts/ApiCaller/ApiCaller';
//import { IGetArticleDataResponse, IArticleData, IGetUserDataResponse, IUserData } from '../parts/ApiCaller/ApiCaller.d';

import { defaultTheme as theme } from '../style/themes';

import './EditorPage.css';


interface IEditorPageProps extends RouteComponentProps {};

interface IEditorPageState {
    authorId: string;
    selectedArticleUrlId: string;
};

const subdomainConfig = getSubdomainConfig();

const editorPageStyle = {
  marginTop: theme.navbarHeight + theme.topBottomMargin,
  marginBottom: theme.topBottomMargin
};


/*

    TODO:
        FRONTEND PATHS:
            /editor/articles
                >> articles: GET, (!)DELETE
                >> List Author's articles to edit.
                >> Verifies session & author, grabs his data
                >> Allows delete *with confirmation (maybe make the type url id like w github delete repo)
                    >> delete will check session & author upstream
            /editor/edit/:articleUrlId
                >> article: UPDATE
                >> Edits article with given article URL ID
                >> Checks session, author, & article existence
                >> Article MUSTb EXIST in this screen
            /editor/new
                >> article: POST
                >> Create a NEW article
                >> Verifies session
                >> At submit, checks for URL ID?
        NEXT BIG QUESTIONS: 
            subroutes for editor panel? (all start /editor)
            put these subroutes under EditorPage, or split it up into multiple page tsx files?

*/


export default class EditorPage extends React.Component<IEditorPageProps, IEditorPageState> {
    constructor(props: IEditorPageProps) {
        super(props);

        this.state = {
            // TODO: Get authorId from session info, once session logic established
            authorId: "lasdkjfh2o478h",
            selectedArticleUrlId: ""
        }
    }

    public render() {
        document.title = subdomainConfig.tabName + " | " + "Editor";

        const { match } = this.props;

        return (
                <div className="editor-page" style={editorPageStyle}>
                    <DefaultNavbar />
                    <Route path={match.url} exact={true} render={(props) => <EditorArticleListing {...props} authorId={this.state.authorId}/>} />
                    <Route path={`${match.url}/login`} component={EditorLoginForm}/>
                    <Route path={`${match.url}/new`} component={EditArticlePanel}/>
                    <Route path={`${match.url}/edit/:articleId`} component={EditArticlePanel} />
                </div>
        );
    }
}
