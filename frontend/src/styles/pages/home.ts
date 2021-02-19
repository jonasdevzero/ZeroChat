import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;

    width: 100vw;
    height: 100vh;

    background-color: ${({ theme }) => theme.backgroundColor};
`;

export const Header = styled.header`
    width: 100vw;
    height: 9rem;

    background-color: ${({ theme }) => theme.header.backgroundColor};
    padding: 0 5rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
        font-size: 3.8rem;
        font-weight: 700;
        color: ${({ theme }) => theme.header.color};
        margin-left: 2rem;
    };
`;

export const Content = styled.div`
    width: 100vw;
    height: calc(100vh - 9rem);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
        font-size: 4rem;
        font-weight: 700;
        color: ${({ theme }) => theme.color};
    };
    h2 {
        font-size: 2.5rem;
        font-weight: 500;
        letter-spacing: .1rem;
        color: ${({ theme }) => theme.color};
    };
`;

export const StyledLink = styled.a`
    color: ${({ theme }) => theme.header.color};
    font-size: 1.8rem;
    font-weight: 500;

    text-decoration: none;

    margin-left: 1rem;
    padding: .7rem 1.7rem;
    border-radius: .3rem;
    cursor: pointer;
    transition: all .3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.header.invertedBackgroundColor};
        color: #000;
    };

    &.signup {
        border: solid .2rem ${({ theme }) => theme.header.color};
    };
`;

export const CallToAction = styled.a`
    font-size: 1.8rem;
    padding: 1.3rem 3rem;
    margin-top: 2rem;
    border-radius: .2rem;

    background-color: ${({ theme }) => theme.color};
    color: ${({ theme }) => theme.contrastColors.Color2};
    font-weight: 500;

    text-decoration: none;
    cursor: pointer;
    transition: opacity .3s ease;

    &:hover {
        opacity: .8;
    };
`;
