import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100%;
    max-width: 75vw;
`;

export const Inner = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`;

export const MessagesContainer = styled.div`
    width: 100%;
    height: calc(100% - 12rem);

    display: flex;
    flex-direction: column;
    padding: 2rem 5rem;

    background-color: #1d1d1d;

    overflow-y: scroll;
`;

export const ContainerWithoutChat = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #1d1d1d;
`;

export const ScrollToBottom = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    position: absolute;

    bottom: 7rem;
    right: 1.4rem;

    border: none;
    outline: none;

    background-color: #191818;
    color: #fff;

    border-radius: 50%;
    cursor: pointer;
`;

export const LoadingMessages = styled.div`
    position: absolute;
    top: 7.5rem;
    left: 50%;
    padding: .5rem;
    background-color: #1e1e1e;
    border-radius: .3rem;

    transform: translateX(-50%);

    img {
        width: 3.5rem;
        height: 3.5rem;
    };
`;
