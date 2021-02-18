import styled from "styled-components";

export const Form = styled.form`
    display: flex;
    flex-direction: column;

    width: 45rem;
    padding: 5.5rem 4rem 4rem 4rem;
    margin-top: 5rem;
    margin-bottom: 2rem;

    background-color: #e1e1e1;
    border-radius: .5rem;
`;

export const Title = styled.h1`
    align-self: center;
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 2.5rem;
    color: #191818;
`;

export const Wrapper = styled.div`
    position: relative;
    max-width: 100%;
    height: 5.2rem;
    margin-top: 2rem;
`;

export const WrapperInputs = styled.div`
    display: flex;

    ${Wrapper} {
        width: 100%;
    };

    ${Wrapper} + ${Wrapper} {
        margin-left: 1rem;
    };
`;

export const Label = styled.label`
    position: absolute;
    bottom: 0rem;
    left: 0rem;

    width: 100%;
    height: 100%;

    pointer-events: none;
    overflow: hidden;
    overflow-y: inherit;

    &::after {
        content: "";
        position: absolute;
        left: 0rem;
        bottom: 0rem;

        width: 100%;
        height: 100%;

        border-bottom: solid .2rem #191818;
        transform: translateX(-100%);
        transition: all .3s ease;
    };
`;

export const Span = styled.span`
    font-size: 1.4rem;
    font-weight: 500;
    color: #101010;

    position: absolute;
    left: .4rem;
    bottom: 1.6rem;

    transition: all .3s ease;
`;

export const Input = styled.input`
    border: none;
    outline: none;

    height: 100%;
    width: 100%;

    font-size: 1.6rem;
    font-weight: 500;
    color: #000;
    padding: 2rem .4rem 1rem .4rem;
    box-sizing: border-box;

    &:focus + ${Label}  ${Span}, &:valid + ${Label}  ${Span} {
        transform: translateY(-120%);
        font-size: 1.3rem;
        color: #505050;
    };

    &:focus + ${Label}::after, &:valid + ${Label}::after {
        transform: translateY(0%);
    };
`;

export const Submit = styled.button`
    margin-top: 2rem;
    height: 5rem;

    border: none;
    outline: none;

    background-color: #191818;
    color: #fff;

    cursor: pointer;
`;

export const Error = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 5rem;
    width: 100%;
    background-color: #FF5150;
    color: #fff;
    border-radius: .2rem;

    strong {
        font-size: 1.8rem;
        font-weight: 700;
    };
`;

export const Info = styled.p`
    font-size: 1.3rem;
    align-self: center;
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
`;

export const StyledLink = styled.a`
    text-decoration: none;
    color: #000;
    font-size: 1.3rem;
    cursor: pointer;
    margin-left: .5rem;

    &:hover {
        text-decoration: underline;
    };
`;
