export const light = {
    textColor: '#000',
    backgroundColor: '#eee',

    pages: {
        landing: {
            backgroundColor: '#eee',

            header: {
                backgroundColor: '#ddd',

                link: {
                    signup: {
                        color: '#eee',
                        backgroundColor: '#090909'
                    }
                }
            },

            button: {
                color: '#eee',
                backgroundColor: '#090909'
            }
        },
    },

    components: {
        form: {
            containerBackgroundColor: '#eee',
            backgroundColor: '#ddd',
            arrowBackColor: '#090909',
            borderColor: '#777',
            label: {
                span: {
                    colorOnFocus: '#777'
                },
            },
            input: {
                backgroundColor: '#eee',
                color: '#090909'
            },
            submit: {
                backgroundColor: '#090909',
                color: '#eee'
            },
            error: {
                backgroundColor: '#f00',
            },
        },

        warning: {
            backgroundColor: '#ddd',
            loadingBarColor: '#090909'
        },

        loadingContainer: {
            backgroundColor: '#f0f0f0'
        }
    },
};

export const dark = {
    textColor: '#eee',
    backgroundColor: '#151515',

    pages: {
        landing: {
            backgroundColor: '#090909',

            header: {
                backgroundColor: '#000',

                link: {
                    signup: {
                        color: '#090909',
                        backgroundColor: '#eee'
                    }
                }
            },

            button: {
                color: '#090909',
                backgroundColor: '#eee'
            },
        },
    },

    components: {
        form: {
            containerBackgroundColor: '#090909',
            backgroundColor: '#151515',
            arrowBackColor: '#eee',
            borderColor: '#777',
            label: {
                span: {
                    colorOnFocus: '#777'
                },
            },
            input: {
                backgroundColor: '#222',
                color: '#eee'
            },
            submit: {
                backgroundColor: '#eee',
                color: '#090909'
            },
            error: {
                backgroundColor: '#f00',
            },
        },

        warning: {
            backgroundColor: '#171717',
            loadingBarColor: '#eee'
        },

        loadingContainer: {
            backgroundColor: '#090909'
        }
    },
};

const themes = {
    light,
    dark,
}

export const allowedThemes = Object.keys(themes)

export default themes
