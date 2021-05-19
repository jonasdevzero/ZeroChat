import styled from 'styled-components'

export const Search = styled.form`
    display: flex;
    flex-direction: column;

    width: 100%;
    border-bottom: solid .2rem #202020;
    padding-bottom: 1.5rem;
`;

export const SearchInputWrapper = styled.div`
    width: 100%;
    height: 3.5rem;
    position: relative;
`;

export const SearchInput = styled.input`
    width: 100%;
    height: 100%;

    background-color: #202020;
    color: #fff;
    border: none;
    outline: none;
    border-radius: 2rem;
    padding: 0 3.5rem 0 1.2rem;
`;

export const SearchButton = styled.button`
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);

    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;

    .MuiSvgIcon-root {
        color: lightgray;
        font-size: 2rem;
    };
`;

export const ContactFilters = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1.5rem .5rem 0 .5rem;
`;

export const Filter = styled.button`
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 1.4rem;
    color: #aaa;
    cursor: pointer;
    transition: color .3s ease-in-out;

    &.selected {
        color: #fff;
    };
`;

export const RoomsContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: scroll;
`;

export const Room = styled.div`
    width: 100%;
    height: 7rem;

    display: flex;
    align-items: center;

    border-bottom: solid .1rem #202020;
    padding: 0 1rem;

    transition: background-color .2s ease;
    cursor: pointer;

    h3 {
        font-size: 1.6rem;
        font-weight: 500;
        margin-left: 1rem;
    };

    .MuiAvatar-root {
        width: 4.5rem;
        height: 4.5rem;
    };
`;

export const Status = styled.p`
    width: .5rem;
    height: .5rem;

    margin-left: .5rem;
    border-radius: 50%;

    &.online {
        background-color: green;
    };
    &.offline {
        background-color: lightgray;
    };
`;

export const UnreadMessages = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2rem;
    height: 2rem;
    border-radius: 50%;

    background-color: #202020;
    color: #fff;

    margin-left: auto;
    margin-right: 1rem;
`;
