const INITIAL_STATE = {
    theme: 'dark'
};

export default function user(state = INITIAL_STATE, action: any) {
    switch(action.type) {
        case 'TOGGLE_THEME':
            state = { ...state, theme: action.theme };
            break;
    };

    return state;
};
