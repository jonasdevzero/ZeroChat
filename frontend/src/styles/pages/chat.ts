import styled from 'styled-components';

export const Container = styled.main`
    display: flex;
    width: 100vw;
    height: 100vh;

    background-color: #222;
`;

export const Inner = styled.div`
    display: flex;
    flex-direction: column;
    flex: .75;
    height: 100vh;

    position: relative;
`;

export const Header = styled.header`
    height: 7rem;
    width: 100%;

    display: flex;
    align-items: center;

    border-bottom: solid .1rem #555;
`;

export const MessagesContainer = styled.div`
    width: 100%;
    height: calc(100% - 11rem);

    display: flex;
    flex-direction: column;
    padding: 2rem;

    overflow-y: scroll;

    &::-webkit-scrollbar {
        width: 0px;
    };
`;

export const Message = styled.p`
    margin-right: auto;
    font-size: 1.6rem;
`;

export const MessageSender = styled.p`
    margin-left: auto;
    font-size: 1.6rem;
`;

export const Form = styled.form`
    display: flex;
    align-items: center;

    height: 4rem;
    width: 100%;
    position: absolute;
    bottom: 0;
`;

export const Input = styled.input`
    width: 100%;
    height: 4rem;

    padding: 0 1rem;
    outline: none;
    border: none;
    border-radius: 0;
`;

export const Submit = styled.button`
    width: 6rem;
    height: 4rem;

    outline: none;
    border: none;
    border-radius: 0;

    cursor: pointer;
    background-color: lightgray;
`;
