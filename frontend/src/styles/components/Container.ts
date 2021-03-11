import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    width: 100%;
    height: 100%;

    background-color: #303030;

    overflow-y: scroll;
`;

export const Header = styled.header`
    display: flex;
    align-items: flex-end;

    padding: 0 3rem;
    margin: 0 9rem;
    margin-top: 4.6rem;
    border-bottom: solid .1rem #777;

    h1 {
        font-size: 4rem;
        font-weight: 700;
        margin-bottom: 2rem;
    };
`;

export const Inner = styled.div`
    width: 60rem;
    margin: 2.5rem auto;
    padding: 3.5rem;
    border-radius: .7rem;

    background-color: #2c2c2c;
`;
