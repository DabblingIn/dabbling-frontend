import * as React from 'react';

import * as util from '../../util';
import { IGetArticleData } from '../ApiCaller/ApiCaller.d';

import { defaultTheme as theme } from '../../style/themes';
import './Article.css';

export interface IArticleProps extends IGetArticleData {};

const articleStyle = theme.itemBoxStyle;
const titleStyle = theme.articleTitleStyle;

export default class Article extends React.Component<IArticleProps> {

    public render() {
        const articleCreatedAt = new Date(this.props.articleCreatedAt);
        //const articleUpdatedAt = new Date(this.props.articleUpdatedAt);
        return (
            <article className="article" style={articleStyle}>
                <h2 className="article__title" style={titleStyle}>{this.props.articleTitle}</h2>
                <div className="article__name-date-line">
                    <span className="article__author-date-box">
                        <a className="article__author" href={this.props.authorSite}>{this.props.authorName} (<b>{this.props.authorUsername}</b>)</a>
                        <span className="article__created_date">{util.minDateString(articleCreatedAt)}</span>
                        <span className="article__weekday">{util.getWeekdayString(articleCreatedAt)}</span>
                    </span>
                </div>
                <div className="article__content" 
                    dangerouslySetInnerHTML={{ __html: this.props.articleContent }} />
            </article>
        );
    }
}