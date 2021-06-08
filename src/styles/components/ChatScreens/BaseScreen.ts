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

export const Form: any = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 3rem;
    padding: 2rem;
    padding-bottom: 1.5rem;

    background-color: #2f2f2f;
    border-radius: 1rem;
`;

Form.Wrapper = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    margin-left: 1rem;
`;

Form.Wrapper.Input = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    margin-bottom: 2rem;

    &.row {
        flex-direction: row;
        align-items: center;
    };
`;

Form.Wrapper.Image = styled.div`
    position: relative;
    min-width: 15rem;
    max-width: 15rem;
    height: 15rem;
    border-radius: 50%;

    .MuiAvatar-root {
        width: 100%;
        height: 100%;
    };
`;

Form.Wrapper.Button = styled.div`
    display: flex;

    &.right {
        margin-right: auto;
    };
`;

Form.Label = styled.label`
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

Form.Input = styled.input`
    height: 4rem;
    width: 100%;

    border: none;
    border-radius: .7rem;
    outline: none;

    padding: 0 .7rem;

    font-size: 1.6rem;
    color: #fff;
    background-color: #353535;
`;

Form.Button = styled.button`
    height: 4rem;

    color: #fff;
    font-size: 1.4rem;
    background-color: #222;

    padding: .5rem 2rem;
    border: none;
    border-radius: .7rem;
    outline: none;
    cursor: pointer;

    & + &, div + & {
        margin-left: 1rem;
    };
    &.cancel {
        background-color: #3b3b3b;
    };
    &.password {
        margin: 0;
    };
    &.delete {
        background-color: red;
        font-weight: 700;
    };

    & > img {
        width: 3rem;
        height: 3rem;
    };
`;

Form.Fieldset = styled.fieldset`
    width: 100%;
    border: none;

    & + & {
        margin-top: 3rem;
    };
`;

Form.Legend = styled.legend`
    width: 100%;
    font-size: 1.8rem;

    margin-bottom: 2rem;
    padding: 0 0 1rem 1.5rem;
    border-bottom: solid .1rem #777;
`;

Form.TextArea = styled.textarea`
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

Form.Image = styled.div``;

Form.Image.Label = styled.label`
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
`;

Form.Image.Input = styled.input`
    display: none;
`;

Form.Image.Remove = styled.button`
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
`;

Form.Error = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    height: 4rem;
    width: 100%;

    background-color: red;
    margin-bottom: 2rem;
    border-radius: .7rem;
`;

Form.Error.Message = styled.strong`
    font-size: 1.5rem;
`;
