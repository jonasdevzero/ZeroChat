import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #151515;
`;

export const Section = styled.section`
    width: 100%;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    border-top: .1rem solid #000;

    &.bg {
        background-color: #111;
    };
`;

export const Presentation = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 2rem;

    h3 {
        font-size: 6.4rem;
        font-family: 'Raleway', sans-serif;
        font-weight: 500;
    };
`;

export const SubscribeLink = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25rem;
    height: 7rem;

    font-size: 2.4rem;
    font-family: 'Noto Sans', sans-serif;
    letter-spacing: .1rem;
    font-weight: 300;
    border-radius: 1.5rem;
    margin-top: 3rem;

    background-color: #0e0e0e;
    color: #fff;
    font-weight: 500;

    text-decoration: none;
    cursor: pointer;
    transition: opacity .3s ease;

    &:hover {
        opacity: .9;
    };
`;

export const KnowMore = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);

    h4 {
        font-size: 1.7rem;
        font-family: 'Red  Hat Text', sans-serif;
    };
    .MuiButtonBase-root {
        border-radius: 50%;
    };
    .MuiSvgIcon-root {
        font-size: 4rem;
    }
`;

export const Inner = styled.div`
    width: 80%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
        max-width: 40%;
        width: 100%;
        object-fit: cover;
        visibility: hidden;
        transition: all 1s ease-in-out;
        opacity: 0;

        &.in-view {
            visibility: visible;
            opacity: 1;
            transform: translateX(-3rem)
        };
    };
`;

export const Info = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 45%;
    font-family: 'Red  Hat Text', sans-serif;

    visibility: hidden;
    transition: all 1s ease-in-out;
    opacity: 0;

    &.in-view {
        visibility: visible;
        opacity: 1;
    };

    h2 {
        font-size: 6rem;
        font-weight: 600;
        max-width: 45rem;
    };
    p {
        font-size: 2.8rem;
        margin-top: 2rem;
    };
`;

export const Features = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;

    visibility: hidden;
    opacity: 0;
    transition: all .8s ease-in-out;

    &.in-view {
        opacity: 1;
        visibility: visible;
        transform: translateX(3rem);
    };

    & > div.row {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 4rem;
    };
`;

export const Feature = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 15rem;

    cursor: pointer;
    transition: .3s transform ease-in-out;

    &:hover {
        transform: translateY(-.5rem);
    };

    div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 10rem;
        height: 10rem;

        border-radius: 1.5rem;
        border: solid .2rem #444;

        .MuiSvgIcon-root {
            font-size: 4.5rem;

            &.rotate {
                transform: rotate(45deg);
            };
        };
    };

    span {
        height: 4.2rem;
        margin-top: 1rem;
        font-size: 1.8rem;
        font-family: 'Raleway', sans-serif;
        max-width: 10rem;
        text-align: center;
    };
`;

export const CallToActionCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    visibility: hidden;
    opacity: 0;
    transition: 1s all ease-in-out;

    &.in-view {
        visibility: visible;
        opacity: 1;
    };

    h3 {
        font-size: 5rem;
        font-family: 'Noto Sans', sans-serif;
        font-weight: 500;
    };
    a {
        background-color: #0a0a0a;
    };
`;
