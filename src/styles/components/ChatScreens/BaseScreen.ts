import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    width: 100%;
    height: 100%;

    overflow-y: scroll;
`;

export const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2.5rem 8rem;
    background-color: rgba(0, 0, 0, .15);

    .MuiSvgIcon-root {
        font-size: 3.2rem;
    }
`

export const HeaderTitle = styled.h1`
    color: #fff;
    font-size: 3.6rem;
    font-weight: 400;
`

export const HeaderButton = styled.button`
    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    z-index: 1;
    color: #fff;
    font-size: 1.6rem;

    & + & {
        margin-left: 2rem;
    }

    .MuiSvgIcon-root {
        color: #fff;
        font-size: 2.8rem;
    }
`

export const Picture = styled.div`
    position: relative;
    min-width: 15rem;
    max-width: 15rem;
    height: 15rem;
    border-radius: 50%;

    .MuiAvatar-root {
        width: 100%;
        height: 100%;
    };
`

export const PictureLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;

    width: 15rem;
    height: 15rem;

    border-radius: 50%;
    z-index: 1;
    cursor: pointer;

    .MuiSvgIcon-root {
        font-size: 7rem;
        color: rgba(0, 0, 0, .2);
    };
`

export const PictureInput = styled.input`
    display: none;
`

export const PictureRemove = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 1rem;
    right: .8rem;

    width: 2.5rem;
    height: 2.5rem;
    background-color: #222;

    border: 0;
    outline: none;
    border-radius: 50%;
    z-index: 1;
    cursor: pointer;

    .MuiSvgIcon-root {
        color: #fff;
    };
`
