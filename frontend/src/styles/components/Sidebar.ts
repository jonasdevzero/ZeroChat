import styled from "styled-components";

export const Container = styled.aside`
    display: flex;
    flex-direction: column;
    flex: .25;
    height: 100vh;

    background-color: #181818;
    border-right: solid .1rem #555;

    position: relative;
`;

export const Header = styled.header`
    height: 7rem;
    width: 100%;

    display: flex;
    align-items: center;

    border-bottom: solid .2rem #777;
    padding: 0 1rem;

    h2 {
        margin-left: 1rem;
    };
`;

export const RoomsContainer = styled.div`
    width: 100%;
    height: calc(100% - 12rem);

    overflow-y: scroll;

    &::-webkit-scrollbar {
        width: 0px;
    };
`;

export const Room = styled.div`
    width: 100%;
    height: 8rem;

    display: flex;
    align-items: center;

    border-bottom: solid .1rem #777;
    padding: 0 1rem;

    cursor: pointer;

    h3 {
        font-size: 1.6rem;
        font-weight: 500;
        margin-left: 1rem;
    };
`;

export const SelectChatType = styled.div`
    display: flex;
    align-items: center;

    height: 5rem;
    width: 100%;
    padding: .5rem;

    position: absolute;
    bottom: 0;

    border-top: solid .1rem #777;
`;

export const Status = styled.p`
    width: .7rem;
    height: .7rem;

    margin-left: .5rem;
    border-radius: 50%;

    &.online {
        background-color: green;
    };
    &.offline {
        background-color: lightgray;
    };
`;

export const ChatTypeButton = styled.button`
    width: 3.8rem;
    height: 3.8rem;

    margin-left: 1rem;
    border: none;
    outline: none;
    border-radius: 50%;

    background-color: #000;
    cursor: pointer;

    & > .MuiSvgIcon-root {
        color: #fff;
    };

    &.selected {
        & > .MuiSvgIcon-root {
            color: green;
        };
    };
`;

export const UnreadMessages = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2rem;
    height: 2rem;
    border-radius: 50%;

    background-color: green;
    color: #fff;

    margin-left: auto;
    margin-right: 1rem;
`;
