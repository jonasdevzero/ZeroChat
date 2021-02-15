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
    height: 12vh;

    background-color: ${({ theme }) => theme.header.backgroundColor};
    padding: 0 5rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
        font-size: 2.8rem;
        font-weight: 700;
        color: ${({ theme }) => theme.header.color};
    };
`;

export const Content = styled.div`
    width: 100vw;
    height: 88vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
        font-size: 4rem;
        font-weight: 700;
    };
    h2 {
        font-size: 2.5rem;
        font-weight: 500;
        letter-spacing: .1rem;
    };
`;

export const StyledLink = styled.a`
    color: ${({ theme }) => theme.header.color};
    font-size: 1.8rem;
    font-weight: 600;

    text-decoration: none;

    margin-left: 2rem;
    cursor: pointer;
`;

export const CallToAction = styled.a`
    font-size: 1.8rem;
    padding: 1.3rem 3rem;
    margin-top: 2rem;
    border-radius: .2rem;

    background-color: ${({ theme }) => theme.header.backgroundColor};
    color: ${({ theme }) => theme.header.color};

    text-decoration: none;
    cursor: pointer;
`;
