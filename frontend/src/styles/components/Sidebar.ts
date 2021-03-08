import styled from "styled-components";

export const Container = styled.aside`
    display: flex;
    flex-direction: column;
    flex: .25;
    height: 100vh;

    border-right: solid .1rem #555;

    position: relative;
`;

export const Header = styled.header`
    height: 7rem;
    width: 100%;

    display: flex;
    align-items: center;

    background-color: #1e1e1e;
    padding: 0 .75rem;

    .MuiSvgIcon-root {
        font-size: 2.5rem !important;
        color: #fff;
    };
`;

export const Inner = styled.div`
    height: calc(100% - 7rem);
    width: 100%;

    display: flex;
`;

export const User = styled.div`
    display: flex;
    align-items: center;
    width: 100%;

    cursor: pointer;

    h2 {
        font-size: 1.8rem;
        font-weight: 500;
        margin-left: 1rem;
    };

    .MuiAvatar-root {
        width: 4.5rem;
        height: 4.5rem;
    };
`;

export const RoomsContainer = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    background-color: #2b2b2b;

    overflow-y: scroll;
`;

export const Room = styled.div`
    width: 100%;
    height: 7rem;

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

export const Status = styled.p`
    width: .5rem;
    height: .5rem;

    margin-left: .5rem;
    border-radius: 50%;

    &.online {
        background-color: green;
    };
    &.offline {
        background-color: lightgray;
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

export const Options = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    width: 6.5rem;
    padding: .5rem;

    background-color: #222;
`;

export const ChatTypeButton = styled.button`
    width: 4.2rem;
    height: 4.2rem;

    margin-top: .7rem;
    border: none;
    outline: none;
    border-radius: 50%;

    background-color: #000;
    cursor: pointer;

    & > .MuiSvgIcon-root {
        color: #fff;
        font-size: 2.5rem;
    };

    &.selected {
        & > .MuiSvgIcon-root {
            color: green;
        };
    };
`;
