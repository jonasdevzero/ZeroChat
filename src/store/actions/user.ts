export function toggleTheme(theme: 'light' | 'dark') {
    return {
        type: 'TOGGLE_THEME',
        theme: theme === 'dark' ? 'light' : 'dark',
    };
};

export function updateUser(data) {
    const keys = Object.keys(data);

    return {
        type: 'UPDATE_USER',
        data,
        keys,
    };
};

export function updateContactMessages() {

};
