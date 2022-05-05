import * as React from 'react';
import Helmet from 'react-helmet';
import * as mu from '../../metaUtils';

import * as util from '../../util';
import ItemBox from '../ItemBox/ItemBox';
import ArticleTitle from './ArticleTitle';
import { IGetArticleData } from '../ApiCaller/ApiCaller.d';

import './Article.css';

export interface IArticleProps extends IGetArticleData {};


export default function Article(props: IArticleProps) {
    React.useEffect(() => {
        util.loadTwitterWidgets();
        util.loadHighlightJs();
    });

    const articleCreatedAt = new Date(props.articleCreatedAt);
    return (
        <div>
        <ArticleHelmet
            title={props.articleTitle}
            author={props.authorName}
            description={props.articleDescription}
        />

        <ItemBox>
        <article className="article">
            <ArticleTitle text={props.articleTitle} />
            <div className="article__name-date-line">
                <span className="article__author-date-box">
                    <a className="article__author" href={util.userPageLink(props.authorUsername)}>{props.authorName} (<b>{props.authorUsername}</b>)</a>
                    <span className="article__created_date">{util.minDateString(articleCreatedAt)}</span>
                    <span className="article__weekday">{util.getWeekdayString(articleCreatedAt)}</span>
                </span>
            </div>
            <div className="article__content" 
                dangerouslySetInnerHTML={{ __html: props.articleContent }} />
        </article>
        </ItemBox>
        </div>
    );
}

/**
 * Helmet for Article - dynamically generated head tags
 */

interface IArticleHelmetProps {
    title: string;
    author: string;
    description: string;
}

function ArticleHelmet(props: IArticleHelmetProps) {
    const { title, author, description } = props;
    return (
        <Helmet>
            {mu.metaTitleTags(title)}
            {mu.metaAuthorTag(author)}
            {mu.metaDescriptionTags(description)}
        </Helmet>
    );
}