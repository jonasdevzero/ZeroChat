import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    };
    html {
        font-size: 62.5%;
    };
    body {
        color: ${({ theme }) => theme.color};
        font-family: 'Roboto', sans-serif;
    };
    #root {
        width: 100vw;
        height: 100%;
    };

    ::-webkit-scrollbar {
        width: .8rem;
    };
    ::-webkit-scrollbar-thumb {
        background-color: #777;
        border-left: solid .1rem #303030;
    };
    ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    };
`;
