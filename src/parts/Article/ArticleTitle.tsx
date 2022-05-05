import * as React from 'react';

import { defaultTheme as theme } from '../../style/themes';


interface IArticleTitleProps {
    text: string;
}

export default function ArticleTitle(props: IArticleTitleProps) {
    return (
        <h1 className="article__title" style={theme.articleTitleStyle}>
            {props.text}
        </h1>
    );
}
