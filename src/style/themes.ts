
interface IItemBoxStyle {
    backgroundColor: string,
    borderStyle: string,
    borderRadius: number,   // px
    borderColor: string,
    borderWidth: number,    // px
    boxShadow: string,
    padding: string,
    margin: string
};

interface IArticleTitleStyle {
    fontFamily: string,
    fontWeight: number
}

interface IStyleTheme {
    backgroundColor: string;
    articleTitleStyle: IArticleTitleStyle;
    itemBoxStyle: IItemBoxStyle;
    navbarHeight: number;
    topBottomMargin: number;
};


export const defaultTheme:IStyleTheme = {
    backgroundColor: "linear-gradient(to bottom, #3af, skyblue)",     // blue gradient
    articleTitleStyle: {
        fontFamily: "Oswald, helvetica, sans-serif",
        fontWeight: 600
    },
    itemBoxStyle: {
        backgroundColor: "white",
        borderStyle: "solid",
        borderRadius: 5,   // px
        borderColor: "#777",
        borderWidth: 1,    // px
        boxShadow: "2px 2px black",
        padding: "15px 23px",
        margin: "12px 2px"
    },
    navbarHeight: 80,
    topBottomMargin: 20
};