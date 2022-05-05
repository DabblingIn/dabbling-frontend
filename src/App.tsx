import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import ArticlePage from './pages/ArticlePage';
import EditorPage from './pages/EditorPage';
import LoadingPage from './pages/LoadingPage';

import { IReduxStoreState } from './reducers';
import {
  startSessionDataFetch,
  succeedSessionDataFetch,
  failSessionDataFetch
} from './parts/Auth/AuthActions'
import { IAuthReducerState } from './parts/Auth/AuthReducer';
import { getEditorSessionData } from './parts/ApiCaller/ApiCaller';
import { IEditorSessionUser } from './parts/ApiCaller/ApiCaller.d';
import { getSubdomainConfig } from './subdomains';
import * as mu from './metaUtils';

import { defaultTheme as theme } from './style/themes';
import './App.css';
import './style/global.css';

const subdomainConfig = getSubdomainConfig();

/**
 * Google Analytics / Universal Analytics
 */

/*
const history = createBrowserHistory();
// Analytics: Sending on first load
setTimeout(() => {
  console.log('[first-load] sending pageview of pathname:', window.location.pathname);
  if (!isLocalhost()) {
    pageview(
      { dp: window.location.pathname, dt: document.title}, 
      defaultPageViewLogCallback('[first-load]'));
  }
}, 1000);

// Analytics: sending on each history update (frontend routing)
history.listen((location, action) => {
  if (!isLocalhost()) {
    return pageview(
              {dp: location.pathname, dt: document.title }, 
              defaultPageViewLogCallback('[history.listen]'));
  }
})
*/

const backgroundStyle = { 
  backgroundImage: theme.backgroundColor
};

interface IAppState {
  sessionDataRetrieved: boolean;
  editorSessionUser: IAuthReducerState['user'];
  loadingPageErrorMessage: string | null;
}

interface IAppOwnProps {}
type IAppProps = IAppReduxStateMapProps & IAppReduxDispatchMapProps & IAppOwnProps;

interface IAppReduxStateMapProps {
  // state -> props
  sessionDataRetrieved: boolean;
  editorSessionUser: IAuthReducerState['user'];
  fetchingSessionData: boolean;
}

interface IAppReduxDispatchMapProps {
  // dispatch -> props
  succeedSessionDataFetch: (user?: IEditorSessionUser) => any;
  startSessionDataFetch: () => any;
  failSessionDataFetch: () => any;
}


class App extends React.Component<IAppProps, IAppState> {

  public constructor(props: IAppProps) {
    super(props);

    this.state = {
      sessionDataRetrieved: props.sessionDataRetrieved,
      editorSessionUser: props.editorSessionUser,
      loadingPageErrorMessage: null
    }
  }

  public componentDidMount() {
    if (!this.props.sessionDataRetrieved) {
      // no data updated in redux store; fetching
      if (!this.props.fetchingSessionData) {
        this.props.startSessionDataFetch();
        getEditorSessionData()
          .then(({ data: resData }) => {
              if (resData.err === null) {
                if (resData.data === null) {
                  // data retrieved, NO current session
                  this.props.succeedSessionDataFetch();
                  this.setState({
                    sessionDataRetrieved: true
                  });
                } else {
                  // data retrieved, session data retrieved
                  const { user } = resData.data!;
                  this.props.succeedSessionDataFetch(user);
                  this.setState({
                    editorSessionUser: user,
                    sessionDataRetrieved: true
                  });
                }
              } else {
                // error with data retrieval
                this.setState({
                  loadingPageErrorMessage: resData.err
                })
              }
            })
          .catch((err) => {
              this.props.failSessionDataFetch();
              this.setState({
                loadingPageErrorMessage: "Failed session fetch: " + err
              })
            })
      }
    }
  }

  public render() {
    if (this.props.fetchingSessionData && !this.props.sessionDataRetrieved) {
      return (
        <div className="app">
            <div className="app__background" style={backgroundStyle}/>
            <LoadingPage errorMessage={this.state.loadingPageErrorMessage} />
        </div>
      );
    }

    return (
      <Router>
        <AppHelmet
          title={subdomainConfig.name}
        />
        <div className="app">
            <div className="app__background" style={backgroundStyle}/>
            <Route exact={true} path="/" component={HomePage} />
            <Route exact={true} path="/u/:username" component={UserPage} />
            <Route path="/p/:articleUrlId" component={ArticlePage} />
            <Route path="/editor" component={EditorPage} isAuthenticated={false} authorId=""/>
        </div>
      </Router>
    );
  }
}

/**
 * Helmet for the App - Dynamically generated head tags
 */

interface IAppHelmetProps {
  title: string;
}

function AppHelmet(props: IAppHelmetProps) {
  return (
    <Helmet>
      {mu.metaTitleTags(props.title)}
    </Helmet>
  )
}


// Container functions
function mapStateToProps(state: IReduxStoreState, ownProps: IAppOwnProps): IAppReduxStateMapProps {
  const { sessionDataRetrieved, user, fetchingSessionData } = state.auth;
  return {
    sessionDataRetrieved,
    editorSessionUser: user,
    fetchingSessionData
    //isAuthenticated: state.auth.isAuthenticated
  }
}

function mapDispatchToProps(dispatch: Dispatch): IAppReduxDispatchMapProps {
  return {
    succeedSessionDataFetch: (user?: IEditorSessionUser) => dispatch(succeedSessionDataFetch(user)),
    startSessionDataFetch: () => dispatch(startSessionDataFetch()),
    failSessionDataFetch: () => dispatch(failSessionDataFetch())
  }
}

export default connect<IAppReduxStateMapProps, IAppReduxDispatchMapProps, IAppOwnProps, IReduxStoreState>(
  mapStateToProps,
  mapDispatchToProps
)(App);
