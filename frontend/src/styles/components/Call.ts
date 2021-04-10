import styled from "styled-components";

interface IContainer {
    minimized: boolean;
};

export const Container = styled.div<IContainer>`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    position: fixed;
    top: ${({ minimized }) => minimized ? '101%' : 0};
    left: 0;

    transition: top .3s ease-in-out;

    background-color: #222;
    z-index: 1000;
`;

export const UsersContainer = styled.div`
    display: flex;
    width: 100%;
    height: calc(100% - 8rem);
    position: relative;
`;

export const UserVideo = styled.video`
    flex: .5;
    object-fit: cover;
`;

export const LoadingMedia = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 900;

    img {
        width: 10rem;
        height: 10rem;
    };

    span {
        margin-top: 2rem;
        font-size: 1.7rem;
    };
`;

export const ReceivingCall = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    width: 100%;
    height: 100%;

    z-index: 100000;

    .MuiAvatar-root {
        width: 25rem;
        height: 25rem;
    };

    & > span {
        margin-top: 2.5rem;
        margin-bottom: 2rem;
        font-size: 2.8rem;
    };
`;

export const Calling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    margin: 0 auto;

    .MuiAvatar-root {
        width: 25rem;
        height: 25rem;
    };

    span {
        font-size: 2.2rem;
        margin-top: 2.5rem;
        margin-bottom: 2rem;
    };
`;

export const InfoBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 8rem;
    padding: 0 5rem;

    background-color: #111;
`;

export const Buttons = styled.div`
    display: flex;
`;

export const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 5rem;

    background-color: #070707;
    border: none;
    border-radius: 50%;
    outline: none;
    cursor: pointer;

    & + & {
        margin-left: 2.5rem;
    };
    &.no-bg {
        background-color: transparent;
    };

    .MuiSvgIcon-root {
        font-size: 2.8rem;
        color: #fff;

        &.call {
            color: green;
        };
        &.callend {
            color: red;
        };
    };
`;

export const CallTime = styled.span`
    font-size: 1.7rem;
`;

export const Message = styled.strong`
    position: fixed;
    top: 5rem;
    left: 50%;
    transform: translateX(-50%);

    font-size: 1.7rem;
    background-color: #1e1e1e;
    color: #fff;
    padding: .5rem;
    border-radius: .3rem;
`;
