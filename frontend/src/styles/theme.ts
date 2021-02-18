export const light = {
    color: '#000',
    backgroundColor: '#fff',

    contrastColors: {
        Color1: "#ddd",    // light
        Color2: "#fff",    // lightness
        Color3: "#222",    // dark
        Color4: "#000",    // darkness
    },

    header: {
        color: '#fff',
        backgroundColor: '#191818',
        invertedBackgroundColor: "#fff",
    },

    form: {
        backgroundColor: "#eee",

        input: {
            backgroundColor: "#fff",
        },
        span: {
            color: "#505050",
            onFocus: "#999",
        },
        errorColor: "#FF5150",
    },
};

export const dark = {
    color: '#fff',
    backgroundColor: '#111',

    contrastColors: {
        Color1: "#333",    // dark
        Color2: "#000",    // darkness
        Color3: "#eee",    // light
        Color4: "#fff",    // lightness
    },

    header: {
        color: '#fff',
        backgroundColor: '#000',
        invertedBackgroundColor: "#fff",
    },

    form: {
        backgroundColor: "#000",

        input: {
            backgroundColor: "#111",
        },
        span: {
            color: "#eee",
            onFocus: "#505050",
        },
        errorColor: "#FF5150",
    },
};
