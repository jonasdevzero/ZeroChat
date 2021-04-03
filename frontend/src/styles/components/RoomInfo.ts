import styled from "styled-components";

export const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 40%;

    background-color: #2b2b2b;
    border-left: solid .1rem #777;
`;

export const Header = styled.header`
    width: 100%;
    height: 7rem;

    display: flex;
    align-items: center;

    padding: 1rem;
    background-color: #1e1e1e;

    .MuiSvgIcon-root {
        color: #fff;
    };
`;

export const Inner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    padding: 2rem;
    overflow-y: scroll;

    & > .MuiAvatar-root {
        width: 20rem;
        height: 20rem;
    };

    h4 {
        font-size: 2.3rem;
        font-weight: 500;
        margin-top: .5rem;
    };
`;

export const GroupDescription = styled.div`
    width: 100%;
    margin: 1rem 0;

    h4 {
        font-size: 1.8rem;
        font-weight: 500;
        padding: 1rem;
        border-bottom: solid .1rem #777;
    };
    p {
        font-size: 1.4rem;
        padding: 1rem;
    };
`;

export const GroupUsers: any = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    h4 {
        font-size: 1.8rem;
        font-weight: 500;
        padding: 1rem;
        border-bottom: solid .1rem #777;
        margin-bottom: 1rem;
    };
`;

GroupUsers.User = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;

    border-radius: .3rem;
    cursor: pointer;
    transition: background-color .3s ease;

    h5 {
        font-size: 1.6rem;
        margin-left: .5rem;
        font-weight: 500;
    };
    .MuiAvatar-root {
        width: 5rem;
        height: 5rem;
    };

    &:hover {
        background-color: #252525;
    };
`;

GroupUsers.User.Admin = styled.strong`
    margin-left: auto;
    font-size: 1rem;
    font-weight: 600;
`;

export const EditGroupContainer = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;

    .MuiSvgIcon-root {
        color: #fff;
    };
`;
