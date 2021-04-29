import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;

    width: 100vw;
    height: 100vh;

    background-color: ${({ theme }) => theme.pages.landing.backgroundColor};
`;

export const Header = styled.header`
    width: 100vw;
    height: 9rem;

    padding: 0 10rem;
    background-color: ${({ theme }) => theme.pages.landing.header.backgroundColor};

    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
        font-size: 3.8rem;
        font-weight: 700;
        margin-left: 2rem;
    };
`;

export const Content = styled.div`
    width: 100vw;
    height: calc(100vh - 9rem);

    display: flex;
    align-items: center;
    justify-content: center;
`;

export const InitialCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 2rem;

    h2 {
        font-size: 4rem;
        font-weight: 600;
    };
`;

export const StyledLink = styled.a`
    font-size: 1.6rem;
    font-weight: 400;

    line-height: 2rem;
    text-decoration: none;

    padding: .9rem 2rem;
    border-radius: .3rem;
    cursor: pointer;
    transition: color .3s ease;

    & + & {
        margin-left: 2.5rem;
    };
    &:hover {
        opacity: .9;
    }
    &.signup {
        background-color: ${({ theme }) => theme.pages.landing.header.link.signup.backgroundColor};
        color: ${({ theme }) => theme.pages.landing.header.link.signup.color};
        border-radius: 5rem;
    };
`;

export const CallToAction = styled.a`
    width: fit-content;
    font-size: 1.8rem;
    padding: 1.3rem 3rem;
    margin-top: 3rem;
    border-radius: 10rem;

    background-color: ${({ theme }) => theme.pages.landing.button.backgroundColor};
    color: ${({ theme }) => theme.pages.landing.button.color};
    font-weight: 500;

    text-decoration: none;
    cursor: pointer;
    transition: opacity .3s ease;

    &:hover {
        opacity: .9;
    };
`;
