import styled from 'styled-components'

export const Header = styled.header`
    height: 7rem;
    width: 100%;

    display: flex;
    align-items: center;

    background-color: #171717;
    padding: 0 1rem;

    .MuiSvgIcon-root {
        font-size: 3rem;
        color: #fff;
    };
`;

export const Room = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-right: 20%;

    cursor: pointer;

    h2 {
        font-size: 1.8rem;
        font-weight: 500;
        margin-left: 1rem;
    };
    .MuiAvatar-root {
        width: 5rem;
        height: 5rem;
    };
`;
