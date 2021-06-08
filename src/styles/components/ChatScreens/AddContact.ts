import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`

export const Invitations = styled.div`
    display: flex;
    flex-direction: column;
    width: 38rem;
    max-height: 40rem;
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
        font-size: 2rem;
        font-family: 'Roboto', sans-serif;
        color: #aaa;
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
    width: 50rem;
    max-height: 40rem;
    padding: 2.5rem;
    background-color: #171717;
    border-radius: .7rem;
`

export const Form = styled.form`
    width: 100%;
    padding: 0 2rem 2rem 2rem;

    border-bottom: solid .2rem #252525;
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
    margin-top: 3rem;
    padding: 0 2rem;

    overflow-y: scroll;
`;

export const User = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: .2rem;
    padding: 1.5rem;
    border-radius: .7rem;

    background-color: #252525;
    transition: background-color .3s ease;

    cursor: pointer;

    .MuiAvatar-root {
        width: 5rem;
        height: 5rem;
    };

    h3 {
        margin-left: 1rem;
        font-size: 1.7rem;
        color: #aaa;
    };

    & > .MuiSvgIcon-root {
        color: #aaa;
        font-size: 2.5rem;
    };

    &:hover {
        background-color: #282828;
    };
`;

export const WrapperAvatar = styled.div`
    display: flex;
    align-items: center;
`;

export const NotFound = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;

    strong {
        color: #aaa;
        font-size: 1.6rem;
        font-family: 'Roboto', sans-serif;
    };
`;

export const Initial = styled(NotFound)``;
