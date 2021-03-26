import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    height: 100vh;
    max-width: 75vw;
`;

export const Inner = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`;

export const Header = styled.header`
    height: 7rem;
    width: 100%;

    display: flex;
    align-items: center;

    background-color: #1e1e1e;
    padding: 0 1rem;

    .MuiSvgIcon-root {
        font-size: 2.5rem !important;
        color: #fff;
    };
`;

export const Room = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-right: 20%;

    cursor: pointer;

    h2 {
        font-size: 1.6rem;
        font-weight: 500;
        margin-left: 1rem;
    };
`;

export const MessagesContainer = styled.div`
    width: 100%;
    height: calc(100% - 12rem);

    display: flex;
    flex-direction: column;
    padding: 2rem 5rem;

    background-color: #303030;

    overflow-y: scroll;
`;

export const MessageWrapper = styled.div`
    width: 100%;
    padding: 0 3rem;
    margin-top: 1.5rem;

    &.concat {
        margin-top: .3rem;
    };
`;

export const MessageInner = styled.div`
    width: fit-content;
    min-width: 9rem;
    max-width: 65%;
    position: relative;

    padding: .8rem .9rem;
    background-color: #222;

    border-radius: 0 1rem 1rem 1rem;

    &.sender {
        margin-right: 0;
        margin-left: auto;
        border-radius: 1rem 0 1rem 1rem;
    };
`;

export const Message = styled.span`
    font-size: 1.5rem;
    width: max-content;
    margin-right: 6rem;
    line-height: 2rem;
    white-space: pre-wrap;
    flex-wrap: wrap;
`;

export const MessageUsername = styled.p`
    position: absolute;
    top: .5rem;
    left: .5rem;
`;

export const Day = styled.span`
    font-size: 1.6rem;

    margin: 1.5rem auto 0 auto;
    padding: 1rem 2rem;
    background-color: #222;
    border-radius: 1rem;
`;

export const Time = styled.span`
    position: absolute;
    bottom: .5rem;
    right: 1rem;

    font-size: 1.1rem;
    color: lightgray;
`;

export const FormContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    height: 5rem;
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0 1rem;

    background-color: #2a2a2a;

    .MuiSvgIcon-root {
        color: #fff;
        cursor: pointer;
    };
`;

export const Form = styled.form`
    display: flex;
    width: 100%;
`;

export const Input = styled.input`
    width: 100%;
    height: 3.5rem;

    outline: none;
    border: none;
    border-radius: 0;

    color: #fff;
    background-color: #555;
    margin: 0 1rem;
    padding: 0 3.5rem 0 1rem;
    border-radius: .2rem;
`;

export const Submit = styled.button`
    width: 3.5rem;
    height: 3.5rem;

    outline: none;
    border: none;
    border-radius: 0;

    cursor: pointer;
    background-color: transparent;

    position: absolute;
    right: 2.5rem;
`;

export const IconButton = styled.button`
    width: 3.5rem;
    height: 3.5rem;

    outline: none;
    border: none;
    border-radius: 0;
    background-color: transparent;
`;

export const ContainerWithoutChat = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #303030;
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

export const EmojiPickerContainer = styled.div`
    position: absolute;
    bottom: 6rem;
    left: 1rem;
`;
