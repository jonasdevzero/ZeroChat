import styled from "styled-components";

export const InputContainer = styled.div`
    display: flex;
    position: relative;
`;

export const SearchOrCloseButton = styled.button`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    background-color: transparent;
    margin-right: 1rem;
    border: none;
    outline: none;
    cursor: pointer;

    .MuiSvgIcon-root {
        color: lightgray;
        font-size: 2rem;
    };
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    margin-left: 1rem;
`;

export const SearchInput = styled.input`
    width: 100%;
    height: 4rem;

    background-color: #353535;
    color: lightgray;

    padding: 1rem;
    border: none;
    outline: none;
    border-radius: .7rem;
`;

export const SearchInputWrapper = styled.div`
    width: 100%;
    height: 4rem;
    position: relative;

    margin-bottom: 1rem;
`;

export const FilteredContacts: any = styled.div`
    width: 100%;
    position: absolute;

    background-color: rgba(0, 0, 0, .3);
    border-radius: .7rem;

    max-height: 20rem;
    overflow-y: scroll;
    z-index: 1;
`;

FilteredContacts.Contact = styled.div`
    display: flex;
    align-items: center;

    width: 100%;
    height: 6rem;

    padding: 1rem;

    cursor: pointer;
    transition: background-color .2s ease;

    p {
        font-size: 1.4rem;
        margin-left: 1rem;
    };

    .MuiAvatar-root {
        width: 4.5rem;
        height: 4.5rem;
    };

    &:hover {
        background-color: rgba(0, 0, 0, .4);
    };
`;

export const SelectedContacts: any = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    min-height: 10rem;
    max-height: 30rem;

    background-color: #353535;
    padding: 1rem;
    margin-bottom: 3rem;
    border-radius: .7rem;
    overflow-y: scroll;
`;

SelectedContacts.Contact = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    width: 8rem;
    height: 8rem;

    padding: .5rem;
    margin: .2rem;

    background-color: #2e2e2e;
    border-radius: .7rem;

    span {
        font-size: 1.3rem;
        margin-top: .5rem;
    };

    .MuiAvatar-root {
        width: 4.5rem;
        height: 4.5rem;
    };
`;

SelectedContacts.Contact.Remove = styled.button`
    position: absolute;
    top: .2rem;
    right: .2rem;

    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;

    .MuiSvgIcon-root {
        color: #fff;
        font-size: 1.7rem;
    };
`;

SelectedContacts.WithoutContacts = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    strong {
        font-size: 1.7rem;
        color: lightgray;
    };
`;
