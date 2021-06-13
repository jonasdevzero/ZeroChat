import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
`

export const Content = styled.main`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5rem;
`

export const Buttons = styled.div`
    display: flex;
    align-items: center;
`

export const Invitations = styled.div`
    display: flex;
    flex-direction: column;
    width: 38rem;
    max-height: 40rem;
    height: 100%;
    background-color: #171717;
    padding: 2.5rem;
    margin-right: 5rem;
    border-radius: .7rem;
`

export const InvitationsTitle = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 1.5rem;
    border-bottom: solid .2rem #252525;
    margin-bottom: .5rem;

    h2 {
        font-size: 2.5rem;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        color: #fff;
    };
`

export const InvitationsInner = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: scroll;
`

export const Invitation = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: solid .1rem #252525;

    .MuiAvatar-root {
        width: 5rem;
        height: 5rem;
    };

    h3 {
        font-size: 1.7rem;
        color: #aaa;
        margin-left: 1rem;
    };

    .buttons {
        margin-left: auto;

        .MuiButtonBase-root + .MuiButtonBase-root {
            margin-left: 1rem;
        };

        .MuiSvgIcon-root {
            font-size: 2.5rem;
            color: #aaa;
        };
    };
`

export  const SearchUsers = styled.div`
    display: flex;
    flex-direction: column;
    width: 45rem;
    max-height: 40rem;
    height: 100%;
    padding: 2rem;
    background-color: #171717;
    border-radius: .7rem;
`

export const Form = styled.form`
    width: 100%;
    margin-top: 1rem;
`;

export const InputWrapper = styled.div`
    position: relative;
`

export const Input = styled.input`
    width: 100%;
    height: 4rem;

    padding: 0 3.3rem 0 1.5rem;
    border: none;
    outline: none;
    border-radius: 10rem;

    color: lightgray;
    background-color: #252525;
`;

export const SearchButton = styled.span`
    position: absolute;
    top: 50%;
    right: 1.5rem;
    transform: translateY(-50%);

    .MuiSvgIcon-root {
        font-size: 2.2rem;
        color: #aaa;
        cursor: pointer;
    };
`;

export const Users = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    margin-top: 2rem;

    overflow-y: scroll;
`;

export const User = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: .2rem;
    padding: 1rem;
    border-radius: .7rem;

    background-color: #202020;
    transition: opacity .3s ease;

    h3 {
        margin-left: 1rem;
        font-size: 1.7rem;
        font-weight: 400;
    };

    .MuiAvatar-root {
        width: 5rem;
        height: 5rem;
    };

    .MuiSvgIcon-root {
        color: #fff;
        font-size: 3rem;
    };

    &:hover {
        opacity: .7;
    };
`;

export const WrapperAvatar = styled.div`
    display: flex;
    align-items: center;
`;

export const Initial = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 2rem;

    span {
        color: #777;
        font-size: 1.8rem;
        font-family: 'Red Hat Text', sans-serif;
    };
`
