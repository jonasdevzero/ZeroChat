import styled from 'styled-components'

export const Container = styled.footer`
    display: flex;
    width: 100%;
    height: 30rem;
    background-color: #0d0d0d;
    padding: 2rem 3rem 2rem 7rem;
    position: relative;

    hr {
        margin: 2rem 7rem;
    };
`;

export const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        width: 7rem;
    };
    h5 {
        font-size: 1.7rem;
        font-family: 'Red Hat Text', sans-serif;
        font-weight: 400;
        margin-top: 1.5rem;
    };
`;

export const Content = styled.div`
    display: flex;
    padding: 2rem 0;

    div {
        display: flex;
        flex-direction: column;
        margin-right: 10rem;

        h6 {
            font-size: 2rem;
            font-family: 'Red Hat Text', sans-serif;
            font-weight: 500;
        };
    };


`;

export const StyledLink = styled.a`
    font-size: 1.8rem;
    font-weight: 400;
    font-family: 'Red Hat Text', sans-serif;

    color: lightgray;
    text-decoration: none;
    margin-top: 1rem;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    };
`;

export const Credits = styled.span`
    position: absolute;
    bottom: 1rem;
    right: 3rem;
    font-size: 1.4rem;
    font-weight: 500;
    font-family: 'Red Hat Text', sans-serif;

    .MuiSvgIcon-root {
        color: red;
    };
`;
