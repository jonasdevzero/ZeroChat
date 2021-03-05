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
    padding: 0 1rem;

    h2 {
        margin-left: 1rem;
    };
`;

export const MessagesContainer = styled.div`
    width: 100%;
    height: calc(100% - 12rem);

    display: flex;
    flex-direction: column;
    padding: 2rem 5rem;

    overflow-y: scroll;

    translate: scroll .5s ease;

    &::-webkit-scrollbar {
        width: 0px;
    };
`;

export const Message = styled.span`
    position: relative;
    font-size: 1.6rem;

    margin-right: auto;
    margin-bottom: 1rem;

    padding: 1rem 2rem;
    background-color: #333;

    border-radius: 0 .5rem .5rem .5rem;
`;

export const MessageSender = styled(Message)`
    margin-right: 0;
    margin-left: auto;

    border-radius: .5rem 0 .5rem .5rem;
`;

export const MessageUsername = styled.p`
    position: absolute;
    top: .5rem;
    left: .5rem;
`;

export const Form = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    height: 5rem;
    width: 100%;
    position: absolute;
    bottom: 0;

    background-color: #333;
`;

export const Wrapper = styled.div`
    display: flex;

    width: 98%;
    height: max-content;

    position: relative;
`;

export const Input = styled.input`
    width: 100%;
    height: 3.5rem;

    outline: none;
    border: none;
    border-radius: 0;

    color: #fff;
    background-color: #555;
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
    right: 0;
`;

export const ContainerWithoutChat = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ScrollToBottom = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    position: fixed;

    bottom: 7rem;
    right: 1rem;

    border: none;
    outline: none;

    background-color: #000;
    color: #fff;

    border-radius: 50%;
    cursor: pointer;
`;
