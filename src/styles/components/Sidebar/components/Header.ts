import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    align-items: center;
    min-height: 7.2rem;
    padding: .5rem 0;
    margin-bottom: 1.5rem;
    border-bottom: solid .2rem #202020;
`;

export const Title = styled.h2`
    font-size: 2.5rem;
    font-weight: 400;
    font-family: 'Noto Sans', sans-serif;
`;

export const UnreadMessages = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2rem;
    height: 2rem;
    border-radius: 50%;

    background-color: #202020;
    color: #fff;

    margin-left: auto;
    margin-right: 1rem;
`;
