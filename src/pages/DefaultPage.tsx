
import * as React from 'react';

import DefaultNavbar from '../parts/Navbar/DefaultNavbar';

import * as ApiCaller from '../parts/ApiCaller/ApiCaller';
import { IGetArticleListData, IGetArticlesListingResponse } from '../parts/ApiCaller/ApiCaller.d';

import ArticleListing from '../parts/ArticleListing/ArticleListing';

import { sortArticleListingByCreated } from '../util';
import { getSubKey } from '../subdomains';

import { defaultTheme as theme } from '../style/themes';
import './DefaultPage.css';

interface IDefaultPageState {
    articlesListData: IGetArticleListData[];
};

interface IDefaultPageProps {};


const defaultPageStyle = {
  marginTop: theme.navbarHeight + theme.topBottomMargin,
  marginBottom: theme.topBottomMargin
};


export default class DefaultPage extends React.PureComponent<IDefaultPageProps, IDefaultPageState> {
    constructor(props: IDefaultPageProps) {
        super(props);

        this.state = {
            articlesListData: []
        };
    }

    public componentDidMount() {
        const subKey = getSubKey();
        ApiCaller
            .getArticlesListing({ sub: subKey })    // gets articles based on subdomain
            .then((res: IGetArticlesListingResponse) => {
                const articlesListData = sortArticleListingByCreated(res.data.data);
                // TODO: const articlesListDataErr: string = res.data.err;  // Use this backend err message if not null
                this.setState({
                    articlesListData
                });
            })
            //.catch();
    }

    public render() {
        return (
            <div className="default-page" style={defaultPageStyle}>
                <DefaultNavbar />

                <div>
                    <ArticleListing articlesListData={this.state.articlesListData} />
                </div>
            </div>
        );
    }
}