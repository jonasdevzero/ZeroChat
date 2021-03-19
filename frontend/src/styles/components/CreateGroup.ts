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

export const Fieldset = styled.fieldset`
    width: 100%;
    border: none;

    & + & {
        margin-top: 3rem;
    };
`;

export const Legend = styled.legend`
    width: 100%;
    font-size: 1.8rem;

    margin-bottom: 2rem;
    padding: 0 0 1rem 1.5rem;
    border-bottom: solid .1rem #777;
`;

export const TextArea = styled.textarea`
    background-color: #353535;
    color: #fff;
    font-size: 1.6rem;

    min-height: 6rem;
    max-height: 12rem;

    padding: 1rem;
    border: none;
    outline: none;
    resize: vertical;
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

export const FilteredContacts = styled.div`
    width: 100%;
    position: absolute;

    background-color: rgba(0, 0, 0, .3);
    border-radius: .7rem;

    max-height: 20rem;
    overflow-y: scroll;
    z-index: 1;
`;

export const FilteredContact = styled.div`
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

export const SelectedContacts = styled.div`
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

export const SelectedContact = styled.div`
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

export const RemoveSelectedContact = styled.button`
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

export const ContainerWithoutContacts = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    strong {
        font-size: 1.7rem;
        color: lightgray;
    };
`;
