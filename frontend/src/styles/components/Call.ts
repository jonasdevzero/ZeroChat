import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    position: fixed;
    top: 0;
    left: 0;

    background-color: #222;
    z-index: 1000;
`;

export const UsersContainer = styled.div`
    display: flex;
    width: 100%;
    height: calc(100% - 8rem);
`;

export const UserVideo = styled.video`
    flex: auto;
`;

export const UserLoading = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: auto;
`;

export const InfoBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 8rem;

    background-color: #111;
`;

export const ReceivingCallContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    width: 100%;
    height: 100%;

    z-index: 100000;

    .MuiAvatar-root {
        width: 40rem;
        height: 40rem;
    };

    h1 {
        margin-top: 1rem;
        margin-bottom: 2rem;
        font-size: 3rem;
    };
`;

export const Buttons = styled.div`
    display: flex;

    .MuiSvgIcon-root {
        font-size: 4rem;

        &.call {
            color: green;
        };
        &.callend {
            color: red;
        };
    };
`;
