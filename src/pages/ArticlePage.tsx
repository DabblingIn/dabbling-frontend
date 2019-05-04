import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import DefaultNavbar from '../parts/Navbar/DefaultNavbar';
import Article, { IArticleProps } from '../parts/Article/Article';

import * as ApiCaller from '../parts/ApiCaller/ApiCaller';
import { IGetArticleDataResponse, IGetArticleData } from '../parts/ApiCaller/ApiCaller.d';

import { getSubdomainConfig } from '../subdomains';

import { defaultTheme as theme } from '../style/themes';
import './ArticlePage.css';

interface IArticlePageMatchParams {
    articleUrlId: string;
};

interface IArticlePageProps extends RouteComponentProps<IArticlePageMatchParams>{};

interface IArticlePageState extends IArticleProps {
    articleReady: boolean;
    articlePageErr: string | null;
};

const subdomainConfig = getSubdomainConfig();


const articlePageStyle = {
  marginTop: theme.navbarHeight + theme.topBottomMargin,
  marginBottom: theme.topBottomMargin
};


export default class ArticlePage extends React.Component<IArticlePageProps, IArticlePageState> {
    constructor(props: IArticlePageProps) {
        super(props);

        this.state = {
            articleReady: false,
            articlePageErr: null
        } as IArticlePageState;

        this.displayArticle = this.displayArticle.bind(this);
    }

    public componentDidMount() {
        const { articleUrlId } = this.props.match.params;
        ApiCaller
            .getArticleDataByUrlId(articleUrlId)
            .then((articleDataResponse: IGetArticleDataResponse) => {
                const data: IGetArticleData = articleDataResponse.data.data;
                const { err } = articleDataResponse.data;

                if (err) {
                    this.setState({
                        articlePageErr: err
                    });
                    document.title = "Article Error";
                } else {
                    this.setState({ 
                        articleReady: true,
                        ...data 
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    articlePageErr: "Network Error.  Try again later."
                });
                document.title = "Network Error";
            })
    }

    public render() {
        document.title = subdomainConfig.tabName + " | " + this.state.articleTitle;

        return (
            <div className="article-page" style={articlePageStyle}>
                <DefaultNavbar />
                {this.displayArticle()}
            </div>
        );
    }

    private displayArticle() {
        const { articleReady, articlePageErr } = this.state;

        if (articleReady) {
            return <Article {...this.state} />;
        } else if (articlePageErr) {
            return <ArticleErrorPopup message={articlePageErr} />;
        } else {
            return "UNEXPECTED ERROR";
        }
    }
}


interface IArticleErrorPopupProps {
    message: string;
}

function ArticleErrorPopup(props: IArticleErrorPopupProps) {
    return (
        <div className="article-page__error-popup" style={theme.itemBoxStyle}>
            <h1 className="article-page__error-popup__header">Error</h1>
            <p className="article-page__error-popup__text">{props.message}</p>
        </div>
    )
}