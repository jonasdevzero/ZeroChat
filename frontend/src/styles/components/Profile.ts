import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    width: 100%;
    height: 100%;

    background-color: #303030;

    overflow-y: scroll;

    @keyframes screen-animation {
        0% {
            width: 28rem;
            height: 22rem;
        };
        100% {
            width: 37rem;
            height: 31rem;
        };
    };

    @keyframes delete-screent-animation {
        0% {
            width: 28rem;
            height: 18em;
        };
        100% {
            width: 37rem;
            height: 22.2rem;
        };
    };

    @keyframes fill-animation {
        0% {
            background-color: transparent;
        };
        100% {
            background-color: rgba(0, 0, 0, 0.6);
        };
    };
`;

export const Header = styled.header`
    display: flex;
    align-items: flex-end;

    padding: 0 3rem;
    margin: 0 9rem;
    margin-top: 4.6rem;
    border-bottom: solid .1rem #777;

    h1 {
        font-size: 4rem;
        font-weight: 700;
        margin-bottom: 2rem;
    };
`;

export const Inner = styled.div`
    width: 60rem;
    margin: 2.5rem auto;
    padding: 3.5rem;
    border-radius: .7rem;

    background-color: #2c2c2c;
`;

export const Info = styled.div`
    display: flex;
    align-items: center;

    margin-bottom: 5rem;

    div {
        margin-left: 1rem;

        h3 {
            font-size: 3.5rem;
            font-weight: 600;
        };

        p {
            font-size: 1.8rem;
            font-weight: 500;
            color: lightgray;
        };

    };

    .MuiAvatar-root {
        width: 17rem;
        height: 17rem;

        margin: .5rem;
    };
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 3rem;
    padding: 3rem;
    padding-bottom: 2rem;

    background-color: #2f2f2f;
    border-radius: 1rem;
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    margin-bottom: 2rem;
`;

export const Label = styled.label`
    display: flex;
    align-items: center;

    color: lightgray;
    font-size: 1.4rem;
    margin-bottom: .5rem;

    .MuiSvgIcon-root {
        margin-left: .5rem;
        cursor: pointer;
    };
`;

export const Input = styled.input`
    height: 4rem;
    width: 100%;

    border: none;
    border-radius: .7rem;
    outline: none;

    padding: 0 .7rem;

    font-size: 1.7rem;
    color: #fff;
    background-color: #353535;
`;

export const InputContainer = styled.div`
    display: flex;
    position: relative;

    div {
        width: 100%;
    };

    @keyframes message {
        0% {
            top: -4.5rem;
        };
        100% {
            top: -3.5rem;
        };
    };
`;

export const Button = styled.button`
    height: 4rem;

    color: #fff;
    font-size: 1.4rem;
    background-color: #222;

    margin-left: 1rem;
    padding: .5rem 2rem;
    border: none;
    border-radius: .7rem;
    outline: none;
    cursor: pointer;

    &.password {
        margin: 0;
    };
    &.delete {
        background-color: red;
        font-weight: 700;
    };
`;

export const Submit = styled.button`
    padding: 1rem 2rem;
    border: none;
    border-radius: .4rem;
    outline: none;

    font-size: 1.4rem;
    font-weight: 500;
    color: #fff;
    background-color: green;
    cursor: pointer;
`;

export const Message = styled.p`
    position: absolute;
    top: -3.5rem;
    right: -.9rem;

    padding: .7rem;

    background-color: #222;
    border-radius: .3rem;

    animation-name: message;
    animation-duration: 1s;

    &::after {
        content: "";
        width: 1rem;
        height: 1rem;

        position: absolute;
        bottom: -.7rem;
        left: 50%;

        background-color: #222;

        transform: rotate(45deg) translateX(-50%);
    };
`;


export const Screen = styled.div`
    width: 37rem;
    position: fixed;
    top: 50%;
    left: 50%;

    transform: translateX(-50%) translateY(-50%);
    z-index: 11;

    animation-name: screen-animation;
    animation-duration: .2s;

    &.delete {
        animation-name: delete-screent-animation;
        animation-duration: .2s;
    };

    form {
        width: 100%;
        height: 100%;
        margin-bottom: 0;

        h1 {
            margin-bottom: 2rem;
            font-size: 2.5rem;
            font-weight: 700;
        };
    };
`;

export const Fill = styled.div`
    position: fixed;
    top: 0;
    right: 0;

    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;

    animation-name: fill-animation;
    animation-duration: .3s;
`;

export const Close = styled.button`
    border: none;
    outline: none;
    background-color: transparent;

    position: absolute;
    top: 1rem;
    right: 1rem;

    cursor: pointer;

    .MuiSvgIcon-root {
        color: lightgray;
        font-size: 2.5rem;
    };
`;
